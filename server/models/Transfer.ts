export interface ITransfer {
  transactionHash: string;
  from: string;
  to: string;
  price: number;
  timestamp: string;
}

export class Transfer implements ITransfer {
  constructor(
    public transactionHash = "",
    public from = "",
    public to = "",
    public price = 0,
    public timestamp = ""
  ) {}
}
