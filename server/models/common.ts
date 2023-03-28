import { Content, ContentType } from "../models/content";

export const SERVER_URL = "http://127.0.0.1:5000/";
export const CRYPTO_COMPARE_API_URL = "https://min-api.cryptocompare.com";
export const CRYPTO_COMPARE_API_KEY =
  "392661d7ca262f71057f568dae347a15c9b79c1c532bdb4a7b2fc27d0abae34c";

export interface ISubmitResponse {
  hash: string;
  cid: string;
}

export class SubmitResponse implements ISubmitResponse {
  constructor(public hash = "", public cid = "") {}
}

export interface IConversionRate {
  USDToETH: number;
  ETHToUSD: number;
}

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
