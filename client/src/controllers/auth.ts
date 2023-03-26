import { AUTH_ROUTE } from "../constant";
import { ILoginPostData } from "../model/Common";
import { IUser, User } from "../model/User";
import { postRequest } from "./clientRequest";

export async function login(walletAddress: ILoginPostData): Promise<IUser> {
  try {
    const res = await loginWorker(walletAddress);
    console.log(res);
    return res;
  } catch (error) {
    throw error;
  }
}

export async function register(user: IUser) {
  try {
    const res = await registerWorker(user);
    return res;
  } catch (error) {
    throw error;
  }
}

async function loginWorker(walletAddress: ILoginPostData): Promise<IUser> {
  try {
    const res = await postRequest<IUser>(`${AUTH_ROUTE}/login`, walletAddress);
    return res;
  } catch (error) {
    throw error;
  }
}

async function registerWorker(user: User) {
  try {
    const res = await postRequest<IUser>(`${AUTH_ROUTE}/register`, user);
    return res;
  } catch (error) {
    throw error;
  }
}
