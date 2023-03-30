export enum solidityEventType {
  CREATED = 0,
  UPDATE = 1,
  LICENSING = 2,
}

export enum EventType {
  CREATE = "CREATED",
  UPDATED = "UPDATED",
  LICENSING = "LICENSING",
}

export interface IEventFilter {
  CREATED: boolean;
  UPDATED: boolean;
  LICENSING: boolean;
  page: number;
}

export class EventFilter implements IEventFilter {
  constructor(
    public CREATED: false,
    public UPDATED: false,
    public LICENSING: false,
    public page: 1
  ) {}
}

export interface IEvent {
  transactionHash: string;
  contentId: number;
  eventType: EventType;
  from: string;
  to: string;
  price: number;
  lastPrice: number;
  id?: number;
}

export class Event implements IEvent {
  id?: number;
  constructor(
    public transactionHash = "",
    public contentId = 0,
    public eventType = EventType.CREATE,
    public from = "",
    public price = 0,
    public lastPrice = 0,
    public to = "",
    id?: number
  ) {
    if (id) {
      this.id = id;
    }
  }
}
