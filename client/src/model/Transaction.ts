interface ITransaction {
  id: number;
  transactionHash: string;
  from: string;
  to: string;
  price: number;
  timestamp: string;
}

export class Transaction implements ITransaction {
  constructor(
    public id = 0,
    public transactionHash = "",
    public from = "",
    public to = "",
    public price = 0,
    public timestamp = ""
  ) {}
}
