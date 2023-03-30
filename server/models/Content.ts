import { FilterType } from "./common";

export enum SolidityContentType {
  IMAGE = 0,
  AUDIO = 1,
  TEXT = 2,
}

export enum ContentType {
  IMAGE = "Image",
  AUDIO = "Audio",
  TEXT = "Text",
}

export interface IContent {
  id: number;
  ownerAddress: string;
  pHash: string;
  IPFSAddress: string;
  title: string;
  desc: string;
  price: number;
  publishDate: string;
  contentType: ContentType;
}

export interface IContentFilter {
  page: number;
  content: ContentType;
  sort: FilterType;
  q: string;
}

export class Content implements IContent {
  constructor(
    public id = 0,
    public ownerAddress = "",
    public pHash = "",
    public IPFSAddress = "",
    public title = "",
    public desc = "",
    public price = 0,
    public publishDate = "",
    public contentType = ContentType.IMAGE
  ) {}
}
