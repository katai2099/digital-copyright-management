import { Dispatch } from "react";
import { CONFIRM_TRANSACTION, PROCESSING, REQUEST_ROUTE } from "../constant";
import { Web3State, loadingActions } from "../contexts/state";
// import {Contract} from 'web3-eth-contract';
import { BaseRequest, Request, RequestType } from "../model/Request";
import { getRequest, putRequest } from "./clientRequest";
import { AnyAction } from "redux";

function putDCMRequest(baseRequest: BaseRequest): Promise<BaseRequest> {
  return putRequest<BaseRequest>(
    `${REQUEST_ROUTE}/${baseRequest.id}`,
    baseRequest
  )
    .then((request) => Promise.resolve(request))
    .catch((err) => Promise.reject(err));
}

export function approveRequest(
  requestId: number,
  web3State: Web3State,
  dispatch: Dispatch<AnyAction>
): Promise<BaseRequest> {
  dispatch({
    type: loadingActions.setLoading,
    data: { loading: true, loadingText: CONFIRM_TRANSACTION },
  });
  return web3State.contract?.methods
    .approveAgreement(requestId)
    .send({ from: web3State.account })
    .on("transactionHash", function (transactionHash: any) {
      dispatch({
        type: loadingActions.setLoading,
        data: { loading: true, loadingText: PROCESSING },
      });
    })
    .on("confirmation", function (confirmationNumber: any, receipt: any) {
      return Promise.resolve(receipt);
    })
    .on("error", function (error: any) {
      console.log(error);
      return Promise.reject(error);
    })
    .then((res: any) => {
      console.log(res);
      const updateRequest = new BaseRequest(requestId);
      updateRequest.requestType = RequestType.APPROVED;
      return putDCMRequest(updateRequest);
    })
    .then((res: BaseRequest) => {
      dispatch({
        type: loadingActions.resetLoading,
      });
      return Promise.resolve(res);
    })
    .catch((err: any) => {
      dispatch({
        type: loadingActions.resetLoading,
      });
      return Promise.reject(err);
    });
}

export function rejectAgreement(
  requestId: number,
  rejectReason: string,
  web3State: Web3State,
  dispatch: Dispatch<AnyAction>
): Promise<BaseRequest> {
  dispatch({
    type: loadingActions.setLoading,
    data: { loading: true, loadingText: CONFIRM_TRANSACTION },
  });
  return web3State.contract?.methods
    .rejectAgreement(requestId, rejectReason)
    .send({ from: web3State.account })
    .on("transactionHash", function (transactionHash: any) {
      dispatch({
        type: loadingActions.setLoading,
        data: { loading: true, loadingText: PROCESSING },
      });
    })
    .on("confirmation", function (confirmationNumber: any, receipt: any) {
      return Promise.resolve(receipt);
    })
    .on("error", function (error: any) {
      console.log(error);
      return Promise.reject(error);
    })
    .then((res: any) => {
      console.log(res);
      const updateRequest = new BaseRequest(requestId);
      updateRequest.requestType = RequestType.REJECTED;
      updateRequest.rejectReason = rejectReason;
      return putDCMRequest(updateRequest);
    })
    .then((res: BaseRequest) => {
      dispatch({
        type: loadingActions.resetLoading,
      });
      return Promise.resolve(res);
    })
    .catch((err: any) => {
      dispatch({
        type: loadingActions.resetLoading,
      });
      return Promise.reject(err);
    });
}

export function getLicenserRequests(walletAddress: string): Promise<Request[]> {
  return getLicenserRequestsWorker(walletAddress)
    .then((requests) => Promise.resolve(requests))
    .catch((err) => Promise.reject(err));
}

function getLicenserRequestsWorker(walletAddress: string): Promise<Request[]> {
  return getRequest<Request[]>(`${REQUEST_ROUTE}/licenser/`, {
    address: walletAddress,
  })
    .then((requests) => Promise.resolve(requests))
    .catch((err) => Promise.reject(err));
}

export function getLicensingRequests(
  walletAddress: string
): Promise<Request[]> {
  return getLicensingRequestsWorker(walletAddress)
    .then((requests) => Promise.resolve(requests))
    .catch((err) => Promise.reject(err));
}

function getLicensingRequestsWorker(walletAddress: string) {
  return getRequest<Request[]>(`${REQUEST_ROUTE}/licensing/`, {
    address: walletAddress,
  })
    .then((requests) => Promise.resolve(requests))
    .catch((err) => Promise.reject(err));
}
