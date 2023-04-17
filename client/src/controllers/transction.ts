import { USER_ROUTE } from "../constant";
import { Transaction } from "../model/Transaction";
import { getRequest } from "./clientRequest";

export function getTransactions(
  walletAddress: string,
  page: number
): Promise<Transaction[]> {
  return getTransactionsWorker(walletAddress, page)
    .then((transactions) => Promise.resolve(transactions))
    .catch((error) => Promise.reject(error));
}

function getTransactionsWorker(
  walletAddress: string,
  page: number
): Promise<Transaction[]> {
  return getRequest<Transaction[]>(`${USER_ROUTE}/transaction/`, {
    address: walletAddress,
    page: page,
  })
    .then((transactions) => Promise.resolve(transactions))
    .catch((error) => Promise.reject(error));
}
