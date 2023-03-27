import { Content } from "./Content";

export interface ILoginPostData {
  walletAddress: string;
}

export interface ISubmitResponse {
  hash: string;
  cid: string;
}

export interface ILatestContents {
  all: Content[];
  images: Content[];
  audio: Content[];
  texts: Content[];
}

export interface IParamsID {
  id: string;
}
