import { Dispatch } from "react";
import { CONTENT_ROUTE, EVENT_ROUTE, SUBMIT_ROUTE } from "../constant";
import { DcmState, Web3State, loadingActions } from "../contexts/state";
import {
  IContentFilter,
  ILatestContents,
  ISubmitResponse,
  SortType,
} from "../model/Common";
import { Content, ContentType } from "../model/Content";
import { Event } from "../model/Event";
import { getSolidityContentType, keyValuePair } from "../utils";
import { getRequest, postRequest } from "./clientRequest";
import { AnyAction } from "redux";

export function launchFormValidation(
  content: Content,
  selectedFile: File | null
) {
  const error: keyValuePair = {};
  if (content.title.trim() === "") {
    error.title = "Title is required";
  }
  if (content.desc.trim() === "") {
    error.desc = "Description is required";
  }
  if (content.fieldOfUse.trim() === "") {
    error.fieldOfUse = "Field of use is required";
  }
  if (!selectedFile) {
    error.file = "File to registered is required";
  }
  return error;
}

export function getUserContents(
  walletAddress: string,
  contentType: ContentType,
  sort: SortType,
  page: Number,
  q: string
) {
  const filter = {
    page: page,
    content: contentType,
    sort: sort,
    q: q,
  } as IContentFilter;
  return getUserContentsWorker(walletAddress, filter)
    .then((contents) => Promise.resolve(contents))
    .catch((error) => Promise.reject(error));
}

function getUserContentsWorker(
  walletAddress: string,
  filter: IContentFilter
): Promise<Content[]> {
  return getRequest<Content[]>(
    `${CONTENT_ROUTE}/user/${walletAddress}/`,
    filter
  )
    .then((contents) => Promise.resolve(contents))
    .catch((error) => Promise.reject(error));
}

export function getContents(
  contentType: ContentType,
  sort: SortType,
  page: Number,
  q: string
): Promise<Content[]> {
  const filter = {
    page: page,
    content: contentType,
    sort: sort,
    q: q,
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

export function requestContent(
  content: Content,
  state: DcmState,
  purpose: string,
  fieldOfUse: string
) {
  return state.web3State.contract?.methods
    .requestAgreement(content.id, purpose, fieldOfUse)
    .send({ from: state.web3State.account, value: content.price })
    .then((res: any) => Promise.resolve(res))
    .catch((error: any) => Promise.resolve(error));
}

export function updateContentData(
  content: Content,
  newPrice: number,
  state: DcmState,
  fieldOfUse: string,
  currentEthToUsd: number
) {
  //state.web3State.web3?.utils.toWei(
  // (content.price * state.coinRate.USDToETH).toString()
  // )
  return state.web3State.contract?.methods
    .updateContentData(
      content.id,
      state.web3State.web3?.utils.toWei(
        (newPrice * currentEthToUsd).toString()
      ),
      fieldOfUse
    )
    .send({ from: state.web3State.account })
    .then((res: any) => Promise.resolve(res))
    .catch((error: any) => Promise.resolve(error));
}

export function submitDigitalContent(
  file: File,
  content: Content,
  state: DcmState,
  contentType: ContentType,
  currentEthToUsd: number,
  dispatch: Dispatch<AnyAction>
) {
  // submit to backend (hash and ipfs)
  // upload to blockchain
  const web3 = state.web3State;
  content.contentType = contentType;
  dispatch({
    type: loadingActions.set,
    data: { loading: true, loadingText: "Hashing" },
  });
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
      dispatch({
        type: loadingActions.set,
        data: { loading: true, loadingText: "Please accept transaction" },
      });
      return web3.contract?.methods
        .addContent(
          content.pHash,
          content.IPFSAddress,
          content.title,
          `${state.user.firstname} ${state.user.lastname}`,
          state.user.email,
          content.desc,
          content.fieldOfUse,
          state.web3State.web3?.utils.toWei(
            (content.price * currentEthToUsd).toString()
          ),
          getSolidityContentType(content.contentType)
        )
        .send({ from: web3.account })
        .on("transactionHash", function (transactionHash: any) {
          dispatch({
            type: loadingActions.set,
            data: { loading: true, loadingText: "Deploying" },
          });
        })
        .on("confirmation", function (confirmationNumber: any, receipt: any) {
          return Promise.resolve(receipt);
        })
        .on("error", function (error: any) {
          console.log(error);
          return Promise.reject(error);
        });
    })
    .then((res) => {
      dispatch({
        type: loadingActions.reset,
      });
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
