import { writeFile } from "fs";
import Web3 from "web3";
import { Contract, EventData } from "web3-eth-contract";
import { createContent } from "../database/content";
import { logToContent } from "../utils/utils";

const copyrightManagementArtifact = require("../../client/src/contracts/CopyrightManagement.json");

const copyrightManagementAbi = copyrightManagementArtifact.abi;
let contract: Contract;

export async function initWeb3() {
  const networkID = await web3.eth.net.getId();
  const address = copyrightManagementArtifact.networks[networkID].address;
  contract = new web3.eth.Contract(copyrightManagementAbi, address);
  contract.events
    .addContentEvent()
    .on("connected", function (subscriptionId: any) {
      console.log(subscriptionId);
    })
    .on("data", function (event: EventData) {
      handleCreateEvent(event.returnValues);
    })
    .on("error", function (error: any, receipt: any) {
      console.log(error);
      console.log(receipt);
    });
}

function handleCreateEvent(eventReturnValues: any) {
  const content = logToContent(eventReturnValues._content);
  createContent(content);
}

const web3 = new Web3(Web3.givenProvider || "ws://localhost:7545");

export const getAccounts = async () => {
  const accounts = await web3.eth.accounts.wallet;
  // return accounts;
  return contract;
};

export const getImageCount = async () => {
  const imageCount = await contract.methods.imageCount().call();
  return imageCount;
};

export const isNewImageHash = async (hash: string) => {
  const imageCount = await contract.methods.imageCount().call();
};

export const isNewTextHash = async (hash: string) => {};

export const isNewVideoHash = async (hash: string) => {};
