import { REQUEST_ROUTE } from "../constant";
import { Web3State } from "../contexts/state";
// import {Contract} from 'web3-eth-contract';
import { Request } from "../model/Request";
import { getRequest } from "./clientRequest";

export function approveRequest(
  requestId: number,
  web3State: Web3State
): Promise<any> {
  return web3State.contract?.methods
    .approveAgreement(requestId)
    .send({ from: web3State.account })
    .then((res: any) => Promise.resolve(res))
    .catch((err: any) => Promise.reject(err));
}

export function rejectAgreement(
  requestId: number,
  rejectReason: string,
  web3State: Web3State
): Promise<any> {
  return web3State.contract?.methods
    .rejectAgreement(requestId, rejectReason)
    .send({ from: web3State.account })
    .then((res: any) => Promise.resolve(res))
    .catch((err: any) => Promise.reject(err));
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
