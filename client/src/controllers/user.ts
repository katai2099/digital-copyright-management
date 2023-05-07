import { AxiosError } from "axios";
import { CONFIRM_TRANSACTION, USER_ROUTE } from "../constant";
import { ISearchResult } from "../model/Common";
import { IUser } from "../model/User";
import { isValidEmail, keyValuePair } from "../utils";
import { getRequest, putRequest } from "./clientRequest";
import { DcmState, loadingActions } from "../contexts/state";
import { Dispatch } from "react";
import { AnyAction } from "redux";
import { TransactionReceipt } from "web3-eth";

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
    if (
      err.response?.status === 400 &&
      err.response.data === "user with the same email already exists"
    ) {
      error.email = "Email already exists";
    }
  }
  return error;
}

export function getUserByWalletAddress(walletAddress: string): Promise<IUser> {
  return getRequest<IUser>(`${USER_ROUTE}/${walletAddress}`)
    .then((user) => Promise.resolve(user))
    .catch((error) => Promise.reject(error));
}

export function updateUser(
  user: IUser,
  state: DcmState,
  dispatch: Dispatch<AnyAction>
): Promise<IUser> {
  dispatch({
    type: loadingActions.setLoading,
    data: { loading: true, loadingText: CONFIRM_TRANSACTION },
  });
  const web3 = state.web3State;
  return web3.contract?.methods
    .updateUser(user.firstname, user.lastname)
    .send({ from: web3.account })
    .on("transactionHash", function (transactionHash: any) {
      dispatch({
        type: loadingActions.setLoading,
        data: { loading: true, loadingText: "Deploying" },
      });
    })
    .on("confirmation", function (confirmationNumber: any, receipt: any) {
      return Promise.resolve(receipt);
    })
    .on("error", function (error: any) {
      console.log(error);
      return Promise.reject(error);
    })
    .then((res: TransactionReceipt) => updateUserWorker(user))
    .then((user: IUser) => {
      dispatch({
        type: loadingActions.resetLoading,
      });
      return Promise.resolve(user);
    })
    .catch((error: any) => {
      dispatch({
        type: loadingActions.resetLoading,
      });
      return Promise.reject(error);
    });
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
