import { getRequest } from "./clientRequest";
import { Agreement } from "../model/Agreement";
import { AGREEMENT_ROUTE } from "../constant";

function getLicenserAgreementsWorker(
  walletAddress: string,
  page: number
): Promise<Agreement[]> {
  return getRequest<Agreement[]>(`${AGREEMENT_ROUTE}/licenser/`, {
    address: walletAddress,
    page: page,
  })
    .then((res) => Promise.resolve(res))
    .catch((err) => Promise.reject(err));
}

export function getLicenserAgreements(
  walletAddress: string,
  page: number
): Promise<Agreement[]> {
  return getLicenserAgreementsWorker(walletAddress, page)
    .then((res) => Promise.resolve(res))
    .catch((err) => Promise.reject(err));
}

function getLicensingAgreementsWorker(
  walletAddress: string,
  page: number
): Promise<Agreement[]> {
  return getRequest<Agreement[]>(`${AGREEMENT_ROUTE}/licensing/`, {
    address: walletAddress,
    page: page,
  })
    .then((agreements) => Promise.resolve(agreements))
    .catch((error) => Promise.reject(error));
}

export function getLicensingAgreements(
  walletAddress: string,
  page: number
): Promise<Agreement[]> {
  return getLicensingAgreementsWorker(walletAddress, page)
    .then((agreements) => Promise.resolve(agreements))
    .catch((error) => Promise.reject(error));
}
