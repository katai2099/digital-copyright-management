import { BaseEvent } from "./Event";
import { Request } from "./Request";
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
  fieldOfUse: string;
  price: string;
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
    public fieldOfUse = "",
    public price = "0",
    public publishDate = "",
    public contentType = ContentType.IMAGE
  ) {}
}

export class Content implements IBaseContent {
  constructor(
    public id = 0,
    public ownerAddress = "",
    public owner = new User(),
    public pHash = "",
    public IPFSAddress = "",
    public title = "",
    public desc = "",
    public fieldOfUse = "",
    public price = "0",
    public publishDate = "",
    public contentType = ContentType.IMAGE,
    public event = new BaseEvent(),
    public requests = [] as Request[]
  ) {}
}

export interface createContentEvent {
  transactionHash: string;
  caller: string;
  timestamp: string;
}

export interface CreateContentPostData {
  event: createContentEvent;
  content: BaseContent;
}
