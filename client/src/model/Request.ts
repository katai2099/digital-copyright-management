import { User } from "./User";
import { Content } from "./Content";

export enum SolidityRequestType {
  PENDING = 0,
  REJECTED = 1,
  APPROVED = 2,
}

export enum RequestType {
  PENDING = "Pending",
  REJECTED = "Rejected",
  APPROVED = "Approved",
}

export interface IRequestEvent {
  transactionHash: string;
  requestId: number;
  requestType: RequestType;
  timestamp: string;
}

export class RequestEvent implements IRequestEvent {
  constructor(
    public transactionHash = "",
    public requestId = 0,
    public requestType = RequestType.PENDING,
    public timestamp = ""
  ) {}
}

export interface IRequest {
  id: number;
  licensee: string;
  contentId: number;
  purposeOfUse: string;
  fieldOfUse: string;
  price: number;
  requestType: RequestType;
  timestamp: string;
  rejectReason: string;
}

export class BaseRequest implements IRequest {
  constructor(
    public id = 0,
    public licensee = "",
    public contentId = 0,
    public purposeOfUse = "",
    public fieldOfUse = "",
    public price = 0,
    public requestType = RequestType.PENDING,
    public timestamp = "",
    public rejectReason = ""
  ) {}
}

export class Request implements IRequest {
  constructor(
    public id = 0,
    public licensee = "",
    public contentId = 0,
    public purposeOfUse = "",
    public fieldOfUse = "",
    public price = 0,
    public requestType = RequestType.PENDING,
    public timestamp = "",
    public rejectReason = "",
    public content = new Content(),
    public licensees = new User(),
    public requestEvents = [] as RequestEvent[]
  ) {}
}

export interface createRequestEvent {
  transactionHash: string;
  requestType: RequestType;
  timestamp: string;
}

export interface CreateRequestPostData {
  request: BaseRequest;
  event: createRequestEvent;
}
