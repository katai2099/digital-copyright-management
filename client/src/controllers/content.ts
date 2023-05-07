import { Dispatch } from "react";
import {
  CONFIRM_TRANSACTION,
  CONTENT_ROUTE,
  EVENT_ROUTE,
  HASH_ROUTE,
  PROCESSING,
  REQUEST_ROUTE,
  SUBMIT_ROUTE,
} from "../constant";
import { DcmState, loadingActions } from "../contexts/state";
import {
  IContentFilter,
  ILatestContents,
  ISubmitResponse,
  SortType,
} from "../model/Common";
import {
  BaseContent,
  Content,
  ContentType,
  CreateContentPostData,
  createContentEvent,
} from "../model/Content";
import { Event } from "../model/Event";
import {
  contentToBaseContent,
  createEventLogToContent,
  getSolidityContentType,
  keyValuePair,
  requestEventLogToRequest,
} from "../utils";
import { getRequest, postRequest, putRequest } from "./clientRequest";
import { AnyAction } from "redux";
import { TransactionReceipt } from "web3-eth";
import {
  BaseRequest,
  CreateRequestPostData,
  createRequestEvent,
} from "../model/Request";

export function launchFormValidation(
  content: BaseContent,
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

function postDCMRequest(postData: CreateRequestPostData) {
  return postRequest<BaseRequest>(`${REQUEST_ROUTE}/`, postData)
    .then((req) => Promise.resolve(req))
    .catch((err) => Promise.reject(err));
}

export function requestContent(
  content: Content,
  state: DcmState,
  purpose: string,
  fieldOfUse: string,
  dispatch: Dispatch<AnyAction>
): Promise<BaseRequest> {
  dispatch({
    type: loadingActions.setLoading,
    data: { loading: true, loadingText: CONFIRM_TRANSACTION },
  });
  return state.web3State.contract?.methods
    .requestAgreement(content.id, purpose, fieldOfUse)
    .send({ from: state.web3State.account, value: content.price })
    .on("transactionHash", function (transactionHash: any) {
      dispatch({
        type: loadingActions.setLoading,
        data: { loading: true, loadingText: "Processing" },
      });
    })
    .on("confirmation", function (confirmationNumber: any, receipt: any) {
      return Promise.resolve(receipt);
    })
    .on("error", function (error: any) {
      console.log(error);
      return Promise.reject(error);
    })
    .then((res: TransactionReceipt) => {
      const newRequest = requestEventLogToRequest(
        res.events!.requestEvent.returnValues._request
      );

      const event: createRequestEvent = {
        transactionHash: res.transactionHash,
        requestType: newRequest.requestType,
        timestamp: newRequest.timestamp,
      };

      const postData: CreateRequestPostData = {
        request: newRequest,
        event: event,
      };
      return postDCMRequest(postData);
    })
    .then((res: BaseRequest) => {
      dispatch({
        type: loadingActions.resetLoading,
      });
      return Promise.resolve(res);
    })
    .catch((error: any) => {
      dispatch({
        type: loadingActions.resetLoading,
      });
      return Promise.reject(error);
    });
}

export function putContent(content: BaseContent) {
  return putRequest<string>(`${CONTENT_ROUTE}/${content.id}`, content)
    .then((res) => Promise.resolve(res))
    .catch((err) => Promise.reject(err));
}

export function updateContentData(
  content: Content,
  newPrice: number,
  state: DcmState,
  fieldOfUse: string,
  currentUsdToEth: number,
  dispatch: Dispatch<AnyAction>
) {
  dispatch({
    type: loadingActions.setLoading,
    data: { loading: true, loadingText: CONFIRM_TRANSACTION },
  });
  return state.web3State.contract?.methods
    .updateContentData(
      content.id,
      state.web3State.web3?.utils.toWei(
        (newPrice * currentUsdToEth).toString()
      ),
      fieldOfUse
    )
    .send({ from: state.web3State.account })
    .on("transactionHash", function (transactionHash: any) {
      dispatch({
        type: loadingActions.setLoading,
        data: { loading: true, loadingText: PROCESSING },
      });
    })
    .on("confirmation", function (confirmationNumber: any, receipt: any) {
      return Promise.resolve(receipt);
    })
    .on("error", function (error: any) {
      console.log(error);
      return Promise.reject(error);
    })
    .then((res: any) => {
      console.log(res);
      const updatedContent = contentToBaseContent(content);
      updatedContent.price = state.web3State.web3?.utils.toWei(
        (newPrice * currentUsdToEth).toString()
      )!;
      updatedContent.fieldOfUse =
        fieldOfUse === "" ? updatedContent.fieldOfUse : fieldOfUse;
      return putContent(updatedContent);
    })
    .then((res: any) => {
      dispatch({
        type: loadingActions.resetLoading,
      });
      return Promise.resolve(res);
    })
    .catch((error: any) => {
      dispatch({
        type: loadingActions.resetLoading,
      });
      return Promise.reject(error);
    });
}

function postContent(data: CreateContentPostData): Promise<string> {
  return postRequest<string>(`${CONTENT_ROUTE}/`, data)
    .then((id) => Promise.resolve(id))
    .catch((error) => Promise.reject(error));
}

export function submitDigitalContent(
  file: File,
  content: BaseContent,
  state: DcmState,
  contentType: ContentType,
  currentEthToUsd: number,
  dispatch: Dispatch<AnyAction>
) {
  const web3 = state.web3State;
  content.contentType = contentType;
  dispatch({
    type: loadingActions.setLoading,
    data: { loading: true, loadingText: "Hashing" },
  });
  return Promise.resolve()
    .then(() => {
      if (contentType === ContentType.IMAGE) {
        return submitImage(file, content);
      } else if (contentType === ContentType.AUDIO) {
        return submitAudio(file, content);
      } else {
        return submitText(file, content);
      }
    })
    .then(() => {
      dispatch({
        type: loadingActions.setLoading,
        data: { loading: true, loadingText: CONFIRM_TRANSACTION },
      });
      return web3.contract?.methods
        .addContent(
          content.pHash,
          content.IPFSAddress,
          content.title,
          content.desc,
          content.fieldOfUse,
          state.web3State.web3?.utils.toWei(
            (Number(content.price) * currentEthToUsd).toString()
          ),
          getSolidityContentType(content.contentType)
        )
        .send({ from: web3.account })
        .on("transactionHash", function (transactionHash: any) {
          dispatch({
            type: loadingActions.setLoading,
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
    .then((res: TransactionReceipt) => {
      const newContent = createEventLogToContent(
        res.events!.addContentEvent.returnValues._content
      );

      const event: createContentEvent = {
        transactionHash: res.transactionHash,
        caller: newContent.ownerAddress,
        timestamp: res.events!.addContentEvent.returnValues.timestamp,
      };
      const postData: CreateContentPostData = {
        content: newContent,
        event: event,
      };
      return postContent(postData);
    })
    .then((res) => {
      dispatch({
        type: loadingActions.resetLoading,
      });
      console.log(res);
      return Promise.resolve(res);
    })
    .catch((error) => {
      //TODO: handle hashing error and reject transaction error
      dispatch({
        type: loadingActions.resetLoading,
      });
      console.log(error);
      return Promise.reject(error);
    });
}

function submitImage(image: File, content: BaseContent): Promise<any> {
  return postImage(image)
    .then((response) => {
      content.IPFSAddress = response.cid;
      content.pHash = response.hash;
    })
    .catch((error) => Promise.reject(error));
}

function submitAudio(audio: File, content: BaseContent): Promise<any> {
  return postAudio(audio)
    .then((response) => {
      content.IPFSAddress = response.cid;
      content.pHash = response.hash;
    })
    .catch((error) => Promise.reject(error));
}

function submitText(text: File, content: BaseContent): Promise<any> {
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

export function hashImage(image: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", image);
  return postRequest<string>(`${HASH_ROUTE}/image`, formData, null, true)
    .then((res) => Promise.resolve(res))
    .catch((error) => Promise.reject(error));
}

export function hashText(text: File): Promise<string> {
  const formData = new FormData();
  formData.append("text", text);
  return postRequest<string>(`${HASH_ROUTE}/text`, formData, null, true)
    .then((res) => Promise.resolve(res))
    .catch((error) => Promise.reject(error));
}

export function hashAudio(audio: File): Promise<string> {
  const formData = new FormData();
  formData.append("audio", audio);
  return postRequest<string>(`${HASH_ROUTE}/audio`, formData, null, true)
    .then((res) => Promise.resolve(res))
    .catch((error) => Promise.reject(error));
}

export function hashDigitalContent(
  file: File,
  contentType: ContentType,
  dispatch: Dispatch<AnyAction>
) {
  dispatch({
    type: loadingActions.setLoading,
    data: { loading: true, loadingText: "Hashing" },
  });
  return Promise.resolve()
    .then(() => {
      if (contentType === ContentType.IMAGE) {
        return hashImage(file);
      } else if (contentType === ContentType.AUDIO) {
        return hashAudio(file);
      } else {
        return hashText(file);
      }
    })
    .then((res) => {
      dispatch({
        type: loadingActions.resetLoading,
      });
      return Promise.resolve(res);
    })
    .catch((err) => {
      dispatch({
        type: loadingActions.resetLoading,
      });
      return Promise.reject(err);
    });
}
