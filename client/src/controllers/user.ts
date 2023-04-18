import { AxiosError } from "axios";
import { USER_ROUTE } from "../constant";
import { ISearchResult } from "../model/Common";
import { IUser } from "../model/User";
import { isValidEmail, keyValuePair } from "../utils";
import { getRequest, putRequest } from "./clientRequest";

export function userUpdateValidation(user: IUser) {
  const error: keyValuePair = {};
  if (user.firstname.trim() === "") {
    error.firstname = "firstname is required";
  }
  if (user.lastname.trim() === "") {
    error.lastname = "lastname is required";
  }
  return error;
}

export function userRegisterValidation(user: IUser) {
  const error: keyValuePair = {};
  if (user.firstname.trim() === "") {
    error.firstname = "firstname is required";
  }
  if (user.lastname.trim() === "") {
    error.lastname = "lastname is required";
  }
  if (user.email.trim() === "") {
    error.email = "email is required";
  } else if (!isValidEmail(user.email.trim())) {
    error.email = "Invalid email format";
  }
  return error;
}

export function registerErrorHandler(err: any) {
  const error: keyValuePair = {};
  if (err instanceof AxiosError) {
    if (err.response?.status === 400) {
      if ((err.response.data as string).includes("username")) {
        error.username = "Username already exists";
      }
      if ((err.response.data as string).includes("email")) {
        error.email = "Email already exists";
      }
    }
  }
  return error;
}

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
  return putRequest<IUser>(`${USER_ROUTE}/${user.walletAddress}`, user)
    .then((user) => Promise.resolve(user))
    .catch((error) => Promise.reject(error));
}

export function search(searchTerm: string): Promise<ISearchResult> {
  return searchWorker(searchTerm)
    .then((res) => Promise.resolve(res))
    .catch((error) => Promise.reject(error));
}

function searchWorker(searchTerm: string): Promise<ISearchResult> {
  return getRequest<ISearchResult>(`search/`, { query: searchTerm })
    .then((res) => Promise.resolve(res))
    .catch((error) => Promise.reject(error));
}
