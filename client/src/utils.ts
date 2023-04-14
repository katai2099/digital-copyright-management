import {
  IPFS_URL,
  METAMASK_REJECTION_CODE,
  REJECT_TRANSACTION,
} from "./constant";
import {
  BaseContent,
  Content,
  ContentType,
  SolidityContentType,
} from "./model/Content";
import { DcmState } from "./contexts/state";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { BaseRequest, RequestType } from "./model/Request";

export interface keyValuePair {
  [key: string]: string;
}

export function isObjectEmpty(object: keyValuePair): boolean {
  return Object.keys(object).length === 0;
}

export function clone<T = any>(whatToClone: T): T {
  return JSON.parse(JSON.stringify(whatToClone));
}

export function contentToBaseContent(content: Content): BaseContent {
  const newContent = new BaseContent(
    content.id,
    content.ownerAddress,
    content.pHash,
    content.IPFSAddress,
    content.title,
    content.desc,
    content.fieldOfUse,
    content.price,
    content.publishDate,
    content.contentType
  );
  return newContent;
}

export function getSolidityContentType(
  contentType: ContentType
): SolidityContentType {
  if (contentType === ContentType.IMAGE) {
    return SolidityContentType.IMAGE;
  } else if (contentType === ContentType.AUDIO) {
    return SolidityContentType.AUDIO;
  } else {
    return SolidityContentType.TEXT;
  }
}

export function shallowCompare(
  body: Record<string, any>,
  comparable: Record<string, any>
): boolean {
  for (const field in comparable) {
    if (body[field] && comparable[field] !== body[field]) {
      console.log(
        "Fail request body " +
          field +
          " validation : 1." +
          body[field] +
          " 2." +
          comparable[field]
      );
      return false;
    }
  }
  return true;
}

export const toJSON = (data: any) => {
  return JSON.parse(data);
};

export const getImageSrc = (content: Content | BaseContent): string => {
  if (content.contentType === ContentType.IMAGE) {
    return `${IPFS_URL}${content.IPFSAddress}`;
  } else if (content.contentType === ContentType.AUDIO) {
    return "../../img/mp3.png";
  }
  return "../../img/txt.png";
};

export function debounce<T extends unknown[]>(
  func: (...args: T) => void,
  delay: number
): (...args: T) => void {
  let timer: NodeJS.Timeout | null = null;
  return (...args: T) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      func.call(null, ...args);
    }, delay);
  };
}

export function toWei(value: string, state: DcmState): string {
  return state.web3State.web3!.utils.toWei(value);
}

export function fromWei(value: string, state: DcmState): string {
  if (state.web3State.web3) {
    return Number(state.web3State.web3!.utils.fromWei(value)).toFixed(2);
  }
  return value;
}

export function isValidEmail(email: string): boolean {
  const regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return regex.test(email);
}

export function handleError(error: any): void {
  if (error instanceof AxiosError) {
    // if (error.response?.data.statusCode === 409) {
    //   toast.error(error.response.data.message);
    //   return error.response.data.contentId;
    // }
  } else {
    if (error.code === METAMASK_REJECTION_CODE) {
      toast.error(REJECT_TRANSACTION);
    }
  }
}

export function solidityContentTypeToContentType(
  contentType: string
): ContentType {
  if (contentType === "0") {
    return ContentType.IMAGE;
  } else if (contentType === "1") {
    return ContentType.AUDIO;
  } else {
    return ContentType.TEXT;
  }
}

export function createEventLogToContent(_content: keyValuePair): BaseContent {
  const content = new BaseContent();
  content.ownerAddress = _content.ownerAddress;
  content.id = parseInt(_content.Id);
  content.pHash = _content.pHash;
  content.IPFSAddress = _content.IPFSAddress;
  content.title = _content.title;
  content.desc = _content.desc;
  content.fieldOfUse = _content.fieldOfUse;
  content.price = Number(_content.price);
  content.publishDate = _content.publishDate;
  content.contentType = solidityContentTypeToContentType(_content.contentType);
  return content;
}

export function solidityRequestTypeToRequestType(
  requestType: string
): RequestType {
  if (requestType === "0") {
    return RequestType.PENDING;
  } else if (requestType === "1") {
    return RequestType.REJECTED;
  } else {
    return RequestType.APPROVED;
  }
}

export function requestEventLogToRequest(_request: keyValuePair): BaseRequest {
  const request = new BaseRequest();
  request.id = parseInt(_request.id);
  request.licensee = _request.licensee;
  request.contentId = parseInt(_request.contentId);
  request.purposeOfUse = _request.purposeOfUse;
  request.fieldOfUse = _request.fieldOfUse;
  request.price = Number(_request.price);
  request.requestType = solidityRequestTypeToRequestType(_request.requestType);
  request.rejectReason = _request.rejectReason;
  request.timestamp = _request.timestamp;
  return request;
}
