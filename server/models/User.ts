export interface IUser {
  firstname: string;
  lastname: string;
  email: string;
  walletAddress: string;
}

export class User implements IUser {
  constructor(
    public firstname = "",
    public lastname = "",
    public email = "",
    public walletAddress = ""
  ) {}
}
