import { Dispatch } from "react";
import { AUTH_ROUTE, CONFIRM_TRANSACTION, USER_ROUTE } from "../constant";
import { DcmState, loadingActions } from "../contexts/state";
import { ILoginPostData } from "../model/Common";
import { IUser, User } from "../model/User";
import { getRequest, postRequest } from "./clientRequest";
import { AnyAction } from "redux";
import { TransactionReceipt } from "web3-eth";
import { AxiosError } from "axios";

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

export function register(
  user: IUser,
  state: DcmState,
  dispatch: Dispatch<AnyAction>
) {
  return getRequest<IUser>(`${USER_ROUTE}/email/${user.email}`)
    .then(() => {
      dispatch({
        type: loadingActions.setLoading,
        data: { loading: true, loadingText: CONFIRM_TRANSACTION },
      });
      const web3 = state.web3State;
      return web3.contract?.methods
        .addUser(user.firstname, user.lastname, user.email)
        .send({ from: user.walletAddress })
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
        .then((res: TransactionReceipt) => registerWorker(user))
        .then((user: IUser) => {
          dispatch({
            type: loadingActions.resetLoading,
          });
          return Promise.resolve(user);
        });
    })
    .catch((err: AxiosError) => {
      dispatch({
        type: loadingActions.resetLoading,
      });
      return Promise.reject(err);
    });
}

function registerWorker(user: User): Promise<IUser> {
  return postRequest<IUser>(`${AUTH_ROUTE}/register`, user)
    .then((user) => Promise.resolve(user))
    .catch((error) => Promise.reject(error));
}
