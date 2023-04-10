import { BaseContent, Content } from "./Content";
import { User } from "./User";

interface IBaseAgreement {
  licensee: string;
  licenser: string;
  contentId: number;
  purposeOfUse: string;
  fieldOfUse: string;
  price: number;
  transactionHash: string;
  timestamp: string;
}

export class BaseAgreement implements IBaseAgreement {
  constructor(
    public licensee = "",
    public licenser = "",
    public contentId = 0,
    public purposeOfUse = "",
    public fieldOfUse = "",
    public price = 0,
    public transactionHash = "",
    public timestamp = ""
  ) {}
}

export class Agreement implements IBaseAgreement {
  constructor(
    public licensee = "",
    public licenser = "",
    public contentId = 0,
    public purposeOfUse = "",
    public fieldOfUse = "",
    public price = 0,
    public transactionHash = "",
    public timestamp = "",
    public licensees = new User(),
    public licensers = new User(),
    public content = new Content()
  ) {}
}
