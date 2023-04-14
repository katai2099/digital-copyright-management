import { Content, ContentType } from "./Content";
import { User } from "./User";

export interface IErrorResponse {
  message: string;
  statusCode: number;
  contentId?: number;
}

export interface IConversionRate {
  USDToETH: number;
  ETHToUSD: number;
}

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
  q: string;
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

export interface ISearchResult {
  users: User[];
  contents: Content[];
}

export enum AgreementOption {
  LICENSING = "Licensing",
  LICENSER = "Licenser",
}
