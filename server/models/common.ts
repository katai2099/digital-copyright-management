import { Content, ContentType } from "../models/content";

export interface ISubmitResponse {
  hash: string;
  cid: string;
}

export class SubmitResponse implements ISubmitResponse {
  constructor(public hash = "", public cid = "") {}
}

export const SERVER_URL = "http://127.0.0.1:5000/";

export interface ILatestContents {
  all: Content[];
  images: Content[];
  audio: Content[];
  texts: Content[];
}

export interface IContentFilter {
  page: number;
  content: ContentType;
  sort: FilterType;
}

export enum FilterType {
  LATEST = "Latest",
  OLDEST = "Oldest",
  HIGHEST = "Highest",
  LOWEST = "Lowest",
}
