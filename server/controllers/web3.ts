import Web3 from "web3";
import { Contract, EventData } from "web3-eth-contract";
import { createContent, updateContentPrice } from "../database/content";
import { createEvent } from "../database/event";
import { Event, EventType } from "../models/Event";
import {
  createEventLogToContent,
  licensingEventLogToAgreement,
} from "../utils/utils";
import { Agreement } from "../models/Agreement";
import { createAgreement } from "../database/agreement";

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
      //transactionHash
      //from => _caller
      //content => _content
      //eventType => _action
      handleAddContentEvent(event.returnValues).then(() => {
        addContentEventHandler(event.transactionHash, event.returnValues);
      });
      console.log(event);
    })
    .on("error", function (error: any, receipt: any) {
      console.log(error);
      console.log(receipt);
    });
  contract.events
    .updateContentEvent()
    .on("data", function (event: EventData) {
      //transactionHash
      //from => _caller
      //contentId => _contentId
      //lastPrice => _lastPrice
      //eventType => _action
      updateContentEventHandler(event.transactionHash, event.returnValues);
      console.log(event);
    })
    .on("error", function (error: any, receipt: any) {
      console.log(error);
      console.log(receipt);
    });
  contract.events
    .licensingEvent()
    .on("data", function (event: EventData) {
      //transactionHash
      //from => _licensee
      //to => _licenser
      //contentId => _contentId
      licensingEventHandler(event.transactionHash, event.returnValues);
      addNewAgreement(event.transactionHash, event.returnValues);
      console.log(event);
    })
    .on("error", function (error: any, receipt: any) {
      console.log(error);
      console.log(receipt);
    });
}

function handleAddContentEvent(eventReturnValues: any) {
  const content = createEventLogToContent(eventReturnValues._content);
  return createContent(content);
}

function addNewAgreement(transactionHash: string, eventReturnValues: any) {
  const agreement = licensingEventLogToAgreement(
    transactionHash,
    eventReturnValues._agreement
  );
  createAgreement(agreement);
}

function addContentEventHandler(
  transactionHash: string,
  eventReturnValues: any
) {
  const content = createEventLogToContent(eventReturnValues._content);
  //transactionHash
  //from => _caller
  //content => _content
  //eventType => _action
  console.log(eventReturnValues._caller);
  const event = new Event(
    transactionHash,
    content.id,
    EventType.CREATE,
    eventReturnValues._caller,
    eventReturnValues._caller,
    eventReturnValues.timestamp,
    Number(content.price)
  );
  createEvent(event);
}

function updateContentEventHandler(
  transactionHash: string,
  eventReturnValues: any
) {
  //transactionHash
  //from => _caller
  //contentId => _contentId
  //lastPrice => _lastPrice
  //price => _currentPrice
  //eventType => _action
  const event = new Event(
    transactionHash,
    parseInt(eventReturnValues._contentId),
    EventType.UPDATED,
    eventReturnValues._caller,
    eventReturnValues._caller,
    eventReturnValues.timestamp,
    Number(eventReturnValues._currentPrice),
    Number(eventReturnValues._lastPrice)
  );
  createEvent(event).then(() => {
    updateContentPrice(event.contentId, event.price);
  });
}

function licensingEventHandler(
  transactionHash: string,
  eventReturnValues: any
) {
  //transactionHash
  //from => _licensee
  //to => _licenser
  //contentId => _contentId
  const agreement = licensingEventLogToAgreement(
    transactionHash,
    eventReturnValues._agreement
  );
  // transactionHash,
  // parseInt(eventReturnValues._contentId),
  // EventType.LICENSING,
  // eventReturnValues._licensee,
  // eventReturnValues.timestamp,
  // Number(eventReturnValues._price),
  // 0,
  // eventReturnValues._licenser
  const event = new Event(
    agreement.transactionHash,
    agreement.contentId,
    EventType.LICENSING,
    agreement.licensee,
    agreement.licenser,
    agreement.timestamp,
    Number(eventReturnValues._price),
    0
  );
  createEvent(event);
}

const web3 = new Web3("ws://localhost:7545");

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
