export interface IUser {
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  walletAddress: string;
  id?: number;
}

export class User implements IUser {
  id?: number | undefined;
  constructor(
    public walletAddress = "",
    public username = "",
    public firstname = "",
    public lastname = "",
    public email = "",
    id?: number
  ) {
    if (id) {
      this.id = id;
    }
  }
}
