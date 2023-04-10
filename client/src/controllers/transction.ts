import { USER_ROUTE } from "../constant";
import { Transaction } from "../model/Transaction";
import { getRequest } from "./clientRequest";

export function getTransactions(walletAddress: string): Promise<Transaction[]> {
  return getTransactionsWorker(walletAddress)
    .then((transactions) => Promise.resolve(transactions))
    .catch((error) => Promise.reject(error));
}

function getTransactionsWorker(walletAddress: string): Promise<Transaction[]> {
  return getRequest<Transaction[]>(`${USER_ROUTE}/transaction/${walletAddress}`)
    .then((transactions) => Promise.resolve(transactions))
    .catch((error) => Promise.reject(error));
}
