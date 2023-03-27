import { USER_ROUTE } from "../constant";
import { IUser } from "../model/User";
import { getRequest, putRequest } from "./clientRequest";

export function getUserByWalletAddress(walletAddress: string): Promise<IUser> {
  return getRequest<IUser>(`${USER_ROUTE}/${walletAddress}`)
    .then((user) => Promise.resolve(user))
    .catch((error) => Promise.reject(error));
}

export function updateUser(user: IUser): Promise<IUser> {
  return updateUserWorker(user)
    .then((user) => Promise.resolve(user))
    .catch((error) => Promise.reject(error));
}

function updateUserWorker(user: IUser): Promise<IUser> {
  return putRequest<IUser>(`${USER_ROUTE}/${user.id}`, user)
    .then((user) => Promise.resolve(user))
    .catch((error) => Promise.reject(error));
}
