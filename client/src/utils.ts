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

export interface keyValuePair {
  [key: string]: string;
}

export function isObjectEmpty(object: keyValuePair): boolean {
  return Object.keys(object).length === 0;
}

export function clone<T = any>(whatToClone: T): T {
  return JSON.parse(JSON.stringify(whatToClone));
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
  } else {
    if (error.code === METAMASK_REJECTION_CODE) {
      toast.error(REJECT_TRANSACTION);
    }
  }
}
