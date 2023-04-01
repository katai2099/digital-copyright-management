import { BaseContent } from "./Content";
import { User } from "./User";

interface IBaseAgreement {
  licensee: string;
  licenser: string;
  contentId: number;
  purposeOfUse: string;
  transactionHash: string;
  timestamp: string;
}

export class BaseAgreement implements IBaseAgreement {
  constructor(
    public licensee = "",
    public licenser = "",
    public contentId = 0,
    public purposeOfUse = "",
    public transactionHash = "",
    public timestamp = ""
  ) {}
}

export class Agreement implements IBaseAgreement {
  licensees?: User;
  licensers?: User;
  content?: BaseContent;
  constructor(
    public licensee = "",
    public licenser = "",
    public contentId = 0,
    public purposeOfUse = "",
    public transactionHash = "",
    public timestamp = "",
    licensees?: User,
    licensers?: User,
    content?: BaseContent
  ) {
    if (licensees) {
      this.licensees = licensees;
    }
    if (licensers) {
      this.licensers = licensers;
    }
    if (content) {
      this.content = content;
    }
  }
}
