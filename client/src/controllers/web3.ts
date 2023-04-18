import React from "react";
import { AnyAction } from "redux";
import Web3 from "web3";
import {
  DcmState,
  Web3State,
  userActions,
  web3Actions,
} from "../contexts/state";
import { artifact, contractAbi } from "../contracts/constant";
import { Contract } from "web3-eth-contract";
import detectEthereumProvider from "@metamask/detect-provider";
import { login } from "./auth";
import {
  APP_STATE_KEY,
  CRYPTO_COMPARE_API_KEY,
  CRYPTO_COMPARE_API_URL,
  WEB3_CONNECT_CACHED,
} from "../constant";
import { getRequest } from "./clientRequest";
import { IConversionRate } from "../model/Common";

export function getCurrentUsdToEth(): Promise<string> {
  return getRequest(
    `${CRYPTO_COMPARE_API_URL}/data/price?fsym=USD&tsyms=ETH&apikey=${CRYPTO_COMPARE_API_KEY}`
  )
    .then((res: any) => Promise.resolve(res.ETH))
    .catch((error) => Promise.resolve(error));
}

export function getCoinRate(): Promise<IConversionRate> {
  return getRequest<IConversionRate>("/coinPrice")
    .then((price) => Promise.resolve(price))
    .catch((error) => Promise.reject(error));
}

export async function startLogin(dispatch: React.Dispatch<AnyAction>) {
  try {
    //TODO : connect metamask on launch page
    const walletAddress = await connectMetamask(dispatch);
    console.log("start login wallet " + walletAddress);
    const user = await login({ walletAddress });
    console.log(user);
    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const initMetamask = async (
  dispatch: React.Dispatch<AnyAction>
): Promise<void> => {
  const web3 = new Web3(Web3.givenProvider || "ws://localhost:7545");
  (window as any).web3 = web3;
  const networkId = await web3.eth.net.getId();
  const account = "";
  let address: string, contract: Contract;
  try {
    address = artifact.networks[networkId].address;
    contract = new web3.eth.Contract(contractAbi, address);
    (window as any).contract = contract;

    //TODO:check why state does not update

    dispatch({
      type: web3Actions.init,
      data: { artifact, web3, account, networkId, contract },
    });
    return;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const connectMetamask = async (
  dispatch: React.Dispatch<AnyAction>
): Promise<string> => {
  const provider = await detectEthereumProvider();
  if (provider) {
    // window.alert("this work");
  } else {
    window.alert("No meta mask");
  }
  const web3 = new Web3(Web3.givenProvider || "ws://localhost:7545");
  (window as any).web3 = web3;
  const accounts = await web3.eth.requestAccounts();
  //TODO: handle case where first connecting node is Ethereum
  //it will return eth network id and our contract is not deployed on eth
  //so we will never be able to find contract
  //TODO: listen event when user login to metamask and update localstorage

  //TODO: after enter user credential, login does not update state
  //TODO: handle case when spamming login button HINT: check error throw

  //TODO: handle case when user is on another network and try to login

  // console.log(accounts);
  const account = accounts[0];

  // console.log("this called on refresh");

  const networkId = await web3.eth.net.getId();
  // console.log(networkId);

  let address: string, contract: Contract;
  try {
    address = artifact.networks[networkId].address;
    contract = new web3.eth.Contract(contractAbi, address);
    (window as any).contract = contract;

    //TODO:check why state does not update
    console.log(account);
    dispatch({
      type: web3Actions.init,
      data: { artifact, web3, account, networkId, contract },
    });
    localStorage.setItem(WEB3_CONNECT_CACHED, "injected");
    return account;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const disconnectMetamask = async (
  dispatch: React.Dispatch<AnyAction>,
  state: DcmState
) => {
  localStorage.removeItem(WEB3_CONNECT_CACHED);
  localStorage.removeItem(APP_STATE_KEY);
  // console.log(state);
  dispatch({
    type: web3Actions.disconnect,
    data: { ...state.web3State, account: "" },
  });
  dispatch({
    type: userActions.reset,
  });
};
