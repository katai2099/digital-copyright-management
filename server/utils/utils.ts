import { Content, ContentType } from "../models/content";

export function clone<T = any>(whatToClone: T): T {
  return JSON.parse(JSON.stringify(whatToClone));
}

export function convert<T = any>(whatToConvert: any): T {
  return JSON.parse(JSON.stringify(whatToConvert));
}

export function hexToBin(hexString: string): string {
  let result: string = "";
  for (let i = 0; i < hexString.length; i++) {
    switch (hexString[i].toLowerCase()) {
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

export function isSimilarHammingDistance(
  firstHash: string,
  secondHash: string
): boolean {
  if (firstHash.length !== secondHash.length) return false;
  let dist = 0;
  for (let i = 0; i < firstHash.length; i++) {
    if (firstHash[i] !== secondHash[i]) {
      dist += 1;
    }
  }
  console.log(firstHash);
  console.log(secondHash);
  console.log(dist);
  console.log(firstHash.length);
  console.log(dist / firstHash.length);
  return dist / firstHash.length <= 0.3;
}

export interface keyValuePair {
  [key: string]: string;
}

export function logToContent(_content: keyValuePair): Content {
  const content = new Content();
  content.ownerAddress = _content.ownerAddress;
  content.Id = parseInt(_content.Id);
  content.pHash = _content.pHash;
  content.IPFSAddress = _content.IPFSAddress;
  content.title = _content.title;
  content.ownerName = _content.ownerName;
  content.ownerEmail = _content.ownerEmail;
  content.desc = _content.desc;
  content.price = parseInt(_content.price);
  content.publishDate = _content.publishDate;
  content.contentType = solidityContentTypeToContentType(_content.contentType);
  return content;
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

export function prismaModelToObject() {}
