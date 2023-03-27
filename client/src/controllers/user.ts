import { USER_ROUTE } from "../constant";
import { IUser } from "../model/User";
import { putRequest } from "./clientRequest";

export function updateUser(user: IUser): Promise<IUser> {
  return updateUserWorker(user)
    .then((user) => Promise.resolve(user))
    .catch((error) => Promise.reject(error));
}

function updateUserWorker(user: IUser): Promise<IUser> {
  return putRequest<IUser>(`${USER_ROUTE}/12`, user)
    .then((user) => Promise.resolve(user))
    .catch((error) => Promise.reject(error));
}
