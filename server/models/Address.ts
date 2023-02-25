export interface IAddress {
    userId : string;
    address: string;
}

export class Address implements IAddress {
    userId: string= "";
    address: string = "";
}