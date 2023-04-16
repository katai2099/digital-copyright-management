interface IAgreement {
  licensee: string;
  licenser: string;
  contentId: number;
  purposeOfUse: string;
  fieldOfUse: string;
  price: string;
  transactionHash: string;
  timestamp: string;
  id: number;
}

export class Agreement implements IAgreement {
  constructor(
    public licensee = "",
    public licenser = "",
    public contentId = 0,
    public purposeOfUse = "",
    public fieldOfUse = "",
    public price = "0",
    public transactionHash = "",
    public timestamp = "",
    public id = 0
  ) {}
}
