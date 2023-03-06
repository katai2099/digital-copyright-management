import Web3 from "web3";
import { contract } from "../server";

const copyrightManagementArtifact = require("../../client/src/contracts/CopyrightManagement.json");

const copyrightManagementAbi = copyrightManagementArtifact.abi;

export async function initWeb3() {
  const networkID = await web3.eth.net.getId();
  const address = copyrightManagementArtifact.networks[networkID].address;
  const contract = new web3.eth.Contract(copyrightManagementAbi, address);
  return contract;
}

const web3 = new Web3(Web3.givenProvider || "ws://localhost:7545");

export const getAccounts = async () => {
  //   const accounts = await web3.eth.accounts.wallet;
  //   return accounts;
  return contract;
};
