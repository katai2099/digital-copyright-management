import { ContentType } from "./model/Content";

export const SERVER_URL = "http://127.0.0.1:8082";
export const IPFS_URL = "https://ipfs.io/ipfs/";
export const GOERLI_TEST_NET_URL = "https://goerli.etherscan.io/address/";
export const AUTH_ROUTE = "/auth";
export const USER_ROUTE = "/users";
export const HASH_ROUTE = "/hash";
export const SUBMIT_ROUTE = "/submit";
export const CONTENT_ROUTE = "/contents";
export const EVENT_ROUTE = "/events";
export const APP_STATE_KEY = "APP_STATE";
export const WEB3_CONNECT_CACHED = "WEB3_CONNECT_CACHED_PROVIDER";

export const ContentTypes = [
  ContentType.IMAGE,
  ContentType.AUDIO,
  ContentType.TEXT,
];

export enum ProfileTab {
  CONTENTS = "Contents",
  EVENTS = "Events",
}

export enum ContentFilter {
  ALL = "All",
  IMG = "Img",
  AUDIO = "Audio",
  TEXT = "Text",
}

export const contentFilters = [
  ContentFilter.ALL,
  ContentFilter.IMG,
  ContentFilter.AUDIO,
  ContentFilter.TEXT,
];

export const contentFilter = [
  ContentFilter.IMG,
  ContentFilter.AUDIO,
  ContentFilter.TEXT,
];

export interface ContentWithIcon {
  value: string;
  icon: string;
}

export const contentFiltersWithIcon = [
  { value: ContentType.IMAGE, icon: "las la-image" } as ContentWithIcon,
  { value: ContentType.AUDIO, icon: "las la-file-audio" } as ContentWithIcon,
  { value: ContentType.TEXT, icon: "las la-file-alt" } as ContentWithIcon,
];

export const profileFiltersWithIcon = [
  { value: ProfileTab.CONTENTS, icon: "las la-photo-video" } as ContentWithIcon,
  { value: ProfileTab.EVENTS, icon: "las la-history" } as ContentWithIcon,
];
