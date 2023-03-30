import { BaseEvent } from "./Event";
import { User } from "./User";

export enum ContentType {
  IMAGE = "Image",
  AUDIO = "Audio",
  TEXT = "Text",
}

export enum SolidityContentType {
  IMAGE = 0,
  AUDIO = 1,
  TEXT = 2,
}

interface IBaseContent {
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

export class BaseContent implements IBaseContent {
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

interface IContent {
  id: number;
  owner: User;
  pHash: string;
  IPFSAddress: string;
  title: string;
  desc: string;
  price: number;
  publishDate: string;
  contentType: ContentType;
  event: BaseEvent;
}

export class Content implements IContent {
  constructor(
    public id = 0,
    public owner = new User(),
    public pHash = "",
    public IPFSAddress = "",
    public title = "",
    public desc = "",
    public price = 0,
    public publishDate = "",
    public contentType = ContentType.IMAGE,
    public event = new BaseEvent()
  ) {}
}
