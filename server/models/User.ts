export interface IUser {
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  walletAddress: string;
  id: number;
}

export class User implements IUser {
  constructor(
    public username = "",
    public firstname = "",
    public lastname = "",
    public email = "",
    public walletAddress = "",
    public id = 0
  ) {}
}
