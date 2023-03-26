import { ContentType } from "./model/Content";

export const SERVER_URL = "http://127.0.0.1:8082";
export const AUTH_ROUTE = "/auth";
export const HASH_ROUTE = "/hash";
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

export const contentFilters = ["All", "Img", "Audio", "Text"];

export const contentFilter = ["Img", "Audio", "Text"];

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
