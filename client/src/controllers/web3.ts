import React from "react";
import { AnyAction } from "redux";
import Web3 from "web3";
import { userActions, web3Actions } from "../contexts/state";
import { artifact, contractAbi } from "../contracts/constant";
import { Contract } from "web3-eth-contract";
import detectEthereumProvider from "@metamask/detect-provider";
import { login } from "./auth";
import { APP_STATE_KEY, WEB3_CONNECT_CACHED } from "../constant";

export async function startLogin(dispatch: React.Dispatch<AnyAction>) {
  try {
    const walletAddress = await connectMetamask(dispatch);
    const user = await login({ walletAddress });
    console.log(user);
    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

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
  const accounts = await web3.eth.requestAccounts();
  //TODO: handle case where first connecting node is Ethereum
  //it will return eth network id and our contract is not deployed on eth
  //so we will never be able to find contract
  //TODO: listen event when user login to metamask and update localstorage

  //TODO: after enter user credential, login does not update state
  //TODO: handle case when spamming login button HINT: check error throw

  // console.log(accounts);
  const account = accounts[0];

  // console.log("this called on refresh");

  const networkId = await web3.eth.net.getId();
  // console.log(networkId);

  let address: string, contract: Contract;
  try {
    address = artifact.networks[networkId].address;
    contract = new web3.eth.Contract(contractAbi, address);
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
  dispatch: React.Dispatch<AnyAction>
) => {
  localStorage.removeItem(WEB3_CONNECT_CACHED);
  localStorage.removeItem(APP_STATE_KEY);
  dispatch({
    type: web3Actions.reset,
  });
  dispatch({
    type: userActions.reset,
  });
};
