export interface IUser {
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  address: string;
  walletAddress: string;
}

export class User implements IUser {
  constructor(
    public username = "",
    public firstname = "",
    public lastname = "",
    public email = "",
    public address = "",
    public walletAddress = ""
  ) {}
}
