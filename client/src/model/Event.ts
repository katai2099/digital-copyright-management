import { Content } from "./Content";
import { User } from "./User";

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
  timestamp: string;
  to: string;
  price: string;
  lastPrice: string;
}

export class BaseEvent implements IBaseEvent {
  constructor(
    public id = 0,
    public transactionHash = "",
    public contentId = 0,
    public eventType = EventType.CREATE,
    public from = "",
    public timestamp = "",
    public to = "",
    public price = "0",
    public lastPrice = "0"
  ) {}
}

export class Event implements IBaseEvent {
  content: Content;
  From: User;
  To: User;
  constructor(
    public id = 0,
    public transactionHash = "",
    public contentId = 0,
    public eventType = EventType.CREATE,
    public from = "",
    public timestamp = "",
    public to = "",
    public price = "0",
    public lastPrice = "0",
    content: Content,
    From: User,
    To: User
  ) {
    this.content = content;
    this.From = From;
    this.To = To;
  }
}
