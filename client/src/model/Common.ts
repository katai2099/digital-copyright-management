import { Content, ContentType } from "./Content";

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

export interface IContentFilter {
  page: number;
  content: ContentType;
  sort: SortType;
}

export enum SortType {
  LATEST = "Latest",
  OLDEST = "Oldest",
  HIGHEST = "Highest",
  LOWEST = "Lowest",
}

export enum FilterValue {
  LATEST = "Created: Latest",
  OLDEST = "Created: Oldest",
  HIGHEST = "Price: Highest",
  LOWEST = "Price: Lowest",
}
