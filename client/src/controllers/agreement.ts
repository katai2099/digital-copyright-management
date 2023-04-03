import { getRequest } from "./clientRequest";
import { Agreement } from "../model/Agreement";
import { AGREEMENT_ROUTE } from "../constant";

export function getAgreements(walletAddress: string): Promise<Agreement[]> {
  return getAgreementsWorker(walletAddress)
    .then((agreements) => Promise.resolve(agreements))
    .catch((error) => Promise.reject(error));
}

function getAgreementsWorker(walletAddress: string): Promise<Agreement[]> {
  return getRequest<Agreement[]>(`${AGREEMENT_ROUTE}/${walletAddress}`)
    .then((agreements) => Promise.resolve(agreements))
    .catch((error) => Promise.reject(error));
}
