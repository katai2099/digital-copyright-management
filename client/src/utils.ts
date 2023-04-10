import { IPFS_URL } from "./constant";
import {
  BaseContent,
  Content,
  ContentType,
  SolidityContentType,
} from "./model/Content";
import { DcmState } from "./contexts/state";

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

export function hexToBin(hexString: string): string {
  let result: string = "";
  for (let i = 0; i < hexString.length; i++) {
    switch (hexString[i]) {
      case "0":
        result += "0000";
        break;
      case "1":
        result += "0001";
        break;
      case "2":
        result += "0010";
        break;
      case "3":
        result += "0011";
        break;
      case "4":
        result += "0100";
        break;
      case "5":
        result += "0101";
        break;
      case "6":
        result += "0110";
        break;
      case "7":
        result += "0111";
        break;
      case "8":
        result += "1000";
        break;
      case "9":
        result += "1001";
        break;
      case "a":
        result += "1010";
        break;
      case "b":
        result += "1011";
        break;
      case "c":
        result += "1100";
        break;
      case "d":
        result += "1101";
        break;
      case "e":
        result += "1110";
        break;
      case "f":
        result += "1111";
        break;
      default:
        return "";
    }
  }
  return result;
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

export const isValidEmail = (email: string) => {
  const regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return regex.test(email);
};
