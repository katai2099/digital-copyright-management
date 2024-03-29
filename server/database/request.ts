import { IRequest, IRequestEvent, RequestType } from "../models/Request";
import { prisma } from "./prisma";

export async function createRequest(request: IRequest) {
  try {
    const newRequest = await prisma.requests.create({
      data: {
        id: request.id,
        licensee: request.licensee,
        contentId: request.contentId,
        purposeOfUse: request.purposeOfUse,
        fieldOfUse: request.fieldOfUse,
        price: request.price,
        requestType: request.requestType,
        rejectReason: request.rejectReason,
        timestamp: request.timestamp,
      },
    });
    return newRequest;
  } catch (error) {
    console.log(error);
    throw new Error();
  }
}

//licenser request
export async function getLicenserRequests(
  walletAddress: string,
  page: number,
  filter: string
) {
  try {
    const requests = await prisma.requests.findMany({
      where: {
        AND: [
          {
            content: {
              ownerAddress: walletAddress,
            },
          },
          {
            ...(filter !== "all" ? { requestType: filter } : {}),
          },
        ],
      },
      include: {
        content: true,
        licensees: true,
        requestEvents: true,
      },
      orderBy: {
        timestamp: "desc",
      },
      skip: (page - 1) * 15,
      take: 15,
    });
    return requests;
  } catch (error) {
    console.log(error);
    throw new Error();
  }
}
//licensing request
export async function getLicensingRequests(
  walletAddress: string,
  page: number,
  filter: string
) {
  try {
    const requests = await prisma.requests.findMany({
      where: {
        AND: [
          {
            licensee: walletAddress,
          },
          { ...(filter !== "all" ? { requestType: filter } : {}) },
        ],
      },
      include: {
        content: {
          include: {
            owner: true,
          },
        },
        licensees: true,
        requestEvents: true,
      },
      orderBy: {
        timestamp: "desc",
      },
      skip: (page - 1) * 15,
      take: 15,
    });
    return requests;
  } catch (error) {
    console.log(error);
    throw new Error();
  }
}

export async function createRequestEvent(requestEvent: IRequestEvent) {
  try {
    const newRequestEvent = await prisma.requestEvents.create({
      data: {
        transactionHash: requestEvent.transactionHash,
        requestId: requestEvent.requestId,
        requestType: requestEvent.requestType,
        timestamp: requestEvent.timestamp,
      },
    });
    return newRequestEvent;
  } catch (error) {
    console.log(error);
    throw new Error();
  }
}

export async function getRequestEvents(walletAddress: string) {
  try {
    const requestEvents = await prisma.requests.findMany({
      where: {
        OR: [
          {
            licensee: walletAddress,
          },
          {
            content: {
              ownerAddress: walletAddress,
            },
          },
        ],
      },
      include: {
        requestEvents: true,
        licensees: true,
        content: {
          include: {
            owner: true,
          },
        },
      },
    });
    return requestEvents;
  } catch (error) {
    console.log(error);
    throw new Error();
  }
}

export async function updateRequest(
  requestId: number,
  requestType: RequestType,
  reasonForReject?: string
) {
  try {
    const updateRequest = await prisma.requests.update({
      where: {
        id: requestId,
      },
      data: {
        requestType: requestType,
        ...(reasonForReject !== "" ? { rejectReason: reasonForReject } : {}),
      },
    });
    return updateRequest;
  } catch (error) {
    console.log(error);
    throw new Error();
  }
}
