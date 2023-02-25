export interface IUser {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  address: string;
}

export class User implements IUser {
  constructor(
    public firstname: string = "",
    public lastname: string = "",
    public email: string = "",
    public password: string = "",
    public address: string = ""
  ) {}
}

export class LoginData {
  email: string = "";
  password: string = "";
}
