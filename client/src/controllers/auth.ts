import { AUTH_ROUTE } from "../constant";
import { ILoginPostData } from "../model/Common";
import { IUser, User } from "../model/User";
import { postRequest } from "./clientRequest";

export function login(walletAddress: ILoginPostData): Promise<IUser> {
  return loginWorker(walletAddress)
    .then((user) => Promise.resolve(user))
    .catch((error) => Promise.reject(error));
}

function loginWorker(walletAddress: ILoginPostData): Promise<IUser> {
  return postRequest<IUser>(`${AUTH_ROUTE}/login`, walletAddress)
    .then((user) => Promise.resolve(user))
    .catch((error) => Promise.reject(error));
}

export function register(user: IUser) {
  return registerWorker(user)
    .then((user) => Promise.resolve(user))
    .catch((error) => Promise.reject(error));
}

function registerWorker(user: User) {
  return postRequest<IUser>(`${AUTH_ROUTE}/register`, user)
    .then((user) => Promise.resolve(user))
    .catch((error) => Promise.reject(error));
}
