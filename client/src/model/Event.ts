import { BaseContent } from "./Content";

export enum EventType {
  CREATE = "CREATED",
  UPDATED = "UPDATED",
  LICENSING = "LICENSING",
}

interface IBaseEvent {
  id: number;
  transactionHash: string;
  contentId: number;
  eventType: EventType;
  from: string;
  to: string;
  price: number;
  lastPrice: number;
}

export class BaseEvent implements IBaseEvent {
  constructor(
    public id = 0,
    public transactionHash = "",
    public contentId = 0,
    public eventType = EventType.CREATE,
    public from = "",
    public to = "",
    public price = 0,
    public lastPrice = 0
  ) {}
}

export class Event implements IBaseEvent {
  content: BaseContent;
  constructor(
    public id = 0,
    public transactionHash = "",
    public contentId = 0,
    public eventType = EventType.CREATE,
    public from = "",
    public to = "",
    public price = 0,
    public lastPrice = 0,
    content: BaseContent
  ) {
    this.content = content;
  }
}
