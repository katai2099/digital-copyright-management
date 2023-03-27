import { CONTENT_ROUTE, SUBMIT_ROUTE } from "../constant";
import { DcmState, Web3State } from "../contexts/state";
import { ILatestContents, ISubmitResponse } from "../model/Common";
import { Content, ContentType } from "../model/Content";
import { getSolidityContentType } from "../utils";
import { getRequest, postRequest } from "./clientRequest";

export function getLatestContents() {
  return getRequest<ILatestContents>(`${CONTENT_ROUTE}/latestContents`)
    .then((res) => Promise.resolve(res))
    .catch((err) => Promise.reject(err));
}

export function submitDigitalContent(
  file: File,
  content: Content,
  state: DcmState,
  contentType: ContentType
) {
  // submit to backend (hash and ipfs)
  // upload to blockchain
  const web3 = state.web3State;
  content.contentType = contentType;
  content.ownerName = `${state.user.firstname} ${state.user.lastname}`;
  content.ownerEmail = state.user.email;
  Promise.resolve()
    .then(() => {
      if (contentType === ContentType.IMAGE) {
        return submitImage(file, content, web3);
      } else if (contentType === ContentType.AUDIO) {
        return submitAudio(file, content, web3);
      } else {
        return submitText(file, content, web3);
      }
    })
    .then(() => {
      console.log("contract call");
      return web3.contract?.methods
        .addContent(
          content.pHash,
          content.IPFSAddress,
          content.title,
          content.ownerName,
          content.ownerEmail,
          content.desc,
          content.price,
          getSolidityContentType(content.contentType)
        )
        .send({ from: web3.account });
    })
    .then((res) => {
      console.log(res);
    })
    .catch((error) => {
      console.log(error);
    });
}

function submitImage(
  image: File,
  content: Content,
  web3: Web3State
): Promise<any> {
  return postImage(image)
    .then((response) => {
      content.IPFSAddress = response.cid;
      content.pHash = response.hash;
    })
    .catch((error) => Promise.reject(error));
}

function submitAudio(
  audio: File,
  content: Content,
  web3: Web3State
): Promise<any> {
  return postAudio(audio)
    .then((response) => {
      content.IPFSAddress = response.cid;
      content.pHash = response.hash;
    })
    .catch((error) => Promise.reject(error));
}

function submitText(
  text: File,
  content: Content,
  web3: Web3State
): Promise<any> {
  return postText(text)
    .then((response) => {
      content.IPFSAddress = response.cid;
      content.pHash = response.hash;
    })
    .catch((error) => Promise.reject(error));
}

export function postImage(image: File): Promise<ISubmitResponse> {
  const formData = new FormData();
  formData.append("image", image);
  return postRequest<ISubmitResponse>(
    `${SUBMIT_ROUTE}/image`,
    formData,
    null,
    true
  )
    .then((res) => Promise.resolve(res))
    .catch((error) => Promise.reject(error));
}

export function postAudio(audio: File): Promise<ISubmitResponse> {
  const formData = new FormData();
  formData.append("audio", audio);
  return postRequest<ISubmitResponse>(
    `${SUBMIT_ROUTE}/audio`,
    formData,
    undefined,
    true
  )
    .then((res) => Promise.resolve(res))
    .catch((error) => Promise.reject(error));
}

export function postText(text: File): Promise<ISubmitResponse> {
  const formData = new FormData();
  formData.append("text", text);
  return postRequest<ISubmitResponse>(
    `${SUBMIT_ROUTE}/text`,
    formData,
    undefined,
    true
  )
    .then((res) => Promise.resolve(res))
    .catch((error) => Promise.reject(error));
}

// // hashing and upload to ipfs

// export const hashImage = (image: File): Promise<string> =>
//   postRequest("/hash/image", image, "jf");
