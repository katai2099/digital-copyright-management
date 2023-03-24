import React from "react";
import { AnyAction } from "redux";
import Web3 from "web3";
import { actions, Web3State } from "../contexts/state";
import { artifact, contractAbi } from "../contracts/constant";
import { Contract } from "web3-eth-contract";
import detectEthereumProvider from "@metamask/detect-provider";

export const connectMetamask = async (dispatch: React.Dispatch<AnyAction>) => {
  const provider = await detectEthereumProvider();
  if (provider) {
    window.alert("this work");
  } else {
    window.alert("NO meta mask");
  }
  const web3 = new Web3(Web3.givenProvider || "ws://localhost:7545");
  const accounts = await web3.eth.requestAccounts();
  //TODO: handle case where first connecting node is Ethereum
  //it will return eth network id and our contract is not deployed on eth
  //so we will never be able to find contract
  //TODO: listen event when user login to metamask and update localstorage
  console.log(accounts);
  //   const artifact = require("../contracts/CopyrightManagement.json");
  const networkId = await web3.eth.net.getId();
  console.log(networkId);

  //   const { abi } = artifact;
  let address: string, contract: Contract;
  try {
    address = artifact.networks[networkId].address;
    contract = new Contract(contractAbi, address);
    dispatch({
      type: actions.init,
      data: { artifact, web3, accounts, networkId, contract },
    });
    // const profileArea = document.getElementById("profile-area");
    // profileArea?.classList.toggle("display-profile-area");
    localStorage.setItem("WEB3_CONNECT_CACHED_PROVIDER", "injected");
  } catch (err) {
    console.error(err);
  }
};

export const disconnectMetamask = async (
  dispatch: React.Dispatch<AnyAction>
) => {
  localStorage.removeItem("WEB3_CONNECT_CACHED_PROVIDER");
  dispatch({
    type: actions.reset,
  });
};
