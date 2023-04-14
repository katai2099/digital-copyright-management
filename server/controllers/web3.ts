import Web3 from "web3";
import { Contract, EventData } from "web3-eth-contract";
import { createContent } from "../database/content";
import { createEvent } from "../database/event";
import { Event, EventType } from "../models/Event";
import {
  createEventLogToContent,
  licensingEventLogToAgreement,
  requestEventLogToRequest,
} from "../utils/utils";

import { createAgreement } from "../database/agreement";
import { RequestEvent } from "../models/Request";
import { createRequest, createRequestEvent } from "../database/request";
import { Transfer } from "../models/Transfer";
import { createTransferEvent } from "../database/transfer";

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
      //add content => add event
      // handleAddContentEvent(event.returnValues).then(() => {
      //   addContentEventHandler(event.transactionHash, event.returnValues);
      // });
      // console.log(event);
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

      //update event
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

      //licensing event
      licensingEventHandler(event.transactionHash, event.returnValues);
      //add new agreement
      addNewAgreement(event.transactionHash, event.returnValues);
      console.log(event);
    })
    .on("error", function (error: any, receipt: any) {
      console.log(error);
      console.log(receipt);
    });
  contract.events.requestEvent().on("data", (event: EventData) => {
    //create request
    // requestEventHandler(event.transactionHash, event.returnValues);
  });
  contract.events.updateRequestEvent().on("data", (event: EventData) => {
    //update request
    updateRequestEventHandler(event.transactionHash, event.returnValues);
  });
  contract.events.transferEvent().on("data", (event: EventData) => {
    transferEventHandler(event.transactionHash, event.returnValues);
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

// uint256 id;
// address licensee;
// uint256 contentId;
// string purposeOfUse;
// string restriction;
// string licenseScope;
// uint256 price;
// RequestType requestType;
// string rejectReason;
// uint256 timestamp;

function requestEventHandler(transactionHash: string, eventReturnValues: any) {
  const request = requestEventLogToRequest(eventReturnValues._request);
  const requestEvent = new RequestEvent(
    transactionHash,
    request.id,
    request.requestType,
    request.timestamp
  );
  createRequest(request)
    .then(() => {
      createRequestEvent(requestEvent);
    })
    .catch((error: any) => {
      console.log(error);
    });
}

function updateRequestEventHandler(
  transactionHash: string,
  eventReturnValues: any
) {
  const request = requestEventLogToRequest(eventReturnValues._request);
  // if (request.rejectReason !== "") {
  //   updateRequest(request.id, request.requestType, request.rejectReason);
  // } else {
  //   updateRequest(request.id, request.requestType);
  // }
  const requestEvent = new RequestEvent(
    transactionHash,
    request.id,
    request.requestType,
    request.timestamp
  );
  createRequestEvent(requestEvent);
}

function transferEventHandler(transactionHash: string, eventReturnValues: any) {
  const transfer = new Transfer();
  transfer.transactionHash = transactionHash;
  transfer.from = eventReturnValues._caller;
  transfer.to = eventReturnValues._receiver;
  transfer.price = Number(eventReturnValues._amount);
  transfer.timestamp = eventReturnValues._timestamp;
  createTransferEvent(transfer);
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
  createEvent(event);
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
    agreement.price,
    0
  );
  createEvent(event);
}

const web3 = new Web3("ws://localhost:7545");
