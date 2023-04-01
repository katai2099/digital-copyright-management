import { CONTENT_ROUTE, EVENT_ROUTE, SUBMIT_ROUTE } from "../constant";
import { DcmState, Web3State } from "../contexts/state";
import {
  IContentFilter,
  ILatestContents,
  ISubmitResponse,
  SortType,
} from "../model/Common";
import { Content, ContentType } from "../model/Content";
import { BaseEvent, Event } from "../model/Event";
import { getSolidityContentType } from "../utils";
import { getRequest, postRequest } from "./clientRequest";

export function getContents(
  contentType: ContentType,
  sort: SortType,
  page: Number
): Promise<Content[]> {
  const filter = {
    page: page,
    content: contentType,
    sort: sort,
  } as IContentFilter;
  console.log(filter);
  return getContentsWorker(filter)
    .then((contents) => Promise.resolve(contents))
    .catch((error) => Promise.reject(error));
}

function getContentsWorker(filter: IContentFilter): Promise<Content[]> {
  return getRequest<Content[]>(`${CONTENT_ROUTE}/`, filter)
    .then((contents) => Promise.resolve(contents))
    .catch((error) => Promise.reject(error));
}

export function getContentEvents(id: number, page: number): Promise<Event[]> {
  return getContentEventsWorker(id, page)
    .then((events) => Promise.resolve(events))
    .catch((error) => Promise.reject(error));
}

function getContentEventsWorker(id: number, page: number): Promise<Event[]> {
  return getRequest<Event[]>(`${EVENT_ROUTE}/content/`, {
    id: id,
    page: page,
  })
    .then((events) => Promise.resolve(events))
    .catch((error) => Promise.reject(error));
}

export function getContentById(id: number) {
  return getRequest<Content>(`${CONTENT_ROUTE}/${id}`)
    .then((content) => Promise.resolve(content))
    .catch((error) => Promise.reject(error));
}

export function getLatestContents() {
  return getRequest<ILatestContents>(`${CONTENT_ROUTE}/latestContents`)
    .then((res) => Promise.resolve(res))
    .catch((err) => Promise.reject(err));
}

export function licensingContent(content: Content, state: DcmState) {
  return state.web3State.contract?.methods
    .licensingContent(content.id, "Rich")
    .send({ from: state.web3State.account, value: content.price })
    .then((res: any) => Promise.resolve(res))
    .catch((error: any) => Promise.resolve(error));
}

export function updateContentPrice(
  content: Content,
  newPrice: number,
  state: DcmState
) {
  //state.web3State.web3?.utils.toWei(
  // (content.price * state.coinRate.USDToETH).toString()
  // )
  return state.web3State.contract?.methods
    .updateContentData(
      content.id,
      state.web3State.web3?.utils.toWei(
        (newPrice * state.coinRate.USDToETH).toString()
      )
    )
    .send({ from: state.web3State.account })
    .then((res: any) => Promise.resolve(res))
    .catch((error: any) => Promise.resolve(error));
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
  return Promise.resolve()
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
          `${state.user.firstname} ${state.user.lastname}`,
          state.user.email,
          content.desc,
          state.web3State.web3?.utils.toWei(
            (content.price * state.coinRate.USDToETH).toString()
          ),
          getSolidityContentType(content.contentType)
        )
        .send({ from: web3.account });
    })
    .then((res) => {
      console.log(res);
      return Promise.resolve(res);
    })
    .catch((error) => {
      console.log(error);

      return Promise.reject(error);
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
