import { Response } from "express";
import { Agreement } from "../models/Agreement";
import { Content, ContentType } from "../models/Content";
import { Request, RequestType } from "../models/Request";
import { HashingError } from "./Error";
import { IErrorResponse, InternalServerError } from "../models/common";
import { HttpStatusCode } from "axios";

export function clone<T = any>(whatToClone: T): T {
  return JSON.parse(JSON.stringify(whatToClone));
}

export function toJSON(something: any) {
  return JSON.parse(
    JSON.stringify(
      something,
      (key, value) => (typeof value === "bigint" ? value.toString() : value) // return everything else unchanged
    )
  );
}

export function convert<T = any>(whatToConvert: any): T {
  return toJSON(whatToConvert);
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

export function createEventLogToContent(_content: keyValuePair): Content {
  const content = new Content();
  content.ownerAddress = _content.ownerAddress;
  content.id = parseInt(_content.Id);
  content.pHash = _content.pHash;
  content.IPFSAddress = _content.IPFSAddress;
  content.title = _content.title;
  content.desc = _content.desc;
  content.fieldOfUse = _content.fieldOfUse;
  content.price = _content.price;
  content.publishDate = _content.publishDate;
  content.contentType = solidityContentTypeToContentType(_content.contentType);
  return content;
}

export function requestEventLogToRequest(_request: keyValuePair): Request {
  const request = new Request();
  request.id = parseInt(_request.id);
  request.licensee = _request.licensee;
  request.contentId = parseInt(_request.contentId);
  request.purposeOfUse = _request.purposeOfUse;
  request.fieldOfUse = _request.fieldOfUse;
  request.price = _request.price;
  request.requestType = solidityRequestTypeToRequestType(_request.requestType);
  request.rejectReason = _request.rejectReason;
  request.timestamp = _request.timestamp;
  return request;
}

export function licensingEventLogToAgreement(
  transactionHash: string,
  _agreement: keyValuePair
): Agreement {
  const agreement = new Agreement();
  agreement.licensee = _agreement.licensee;
  agreement.licenser = _agreement.licenser;
  agreement.contentId = parseInt(_agreement.contentId);
  agreement.purposeOfUse = _agreement.purposeOfUse;
  agreement.fieldOfUse = _agreement.fieldOfUse;
  agreement.price = _agreement.price;
  agreement.timestamp = _agreement.timestamp;
  agreement.id = parseInt(_agreement.id);
  agreement.transactionHash = transactionHash;
  return agreement;
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

export function handleDCMError(error: any, res: Response) {
  if (error instanceof HashingError) {
    return res.status(error.errorCode).send({
      message: error.message,
      statusCode: error.errorCode,
      contentId: error.contentId,
    } as IErrorResponse);
  }
  return res.status(HttpStatusCode.InternalServerError).send({
    message: InternalServerError,
    statusCode: HttpStatusCode.InternalServerError,
  } as IErrorResponse);
}
