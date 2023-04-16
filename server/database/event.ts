import { contents, events } from "@prisma/client";
import { EventType, IEvent, IEventFilter } from "../models/Event";
import { prisma } from "./prisma";
import { ContentType } from "../models/Content";

export async function createEvent(event: IEvent) {
  try {
    const createEvent = await prisma.events.create({
      data: {
        contentId: event.contentId,
        transactionHash: event.transactionHash,
        eventType: event.eventType,
        from: event.from,
        timestamp: event.timestamp,
        to: event.to,
        price: event.price,
        lastPrice: event.lastPrice,
      },
    });
    return createEvent;
  } catch (err) {
    console.log(err);
    throw new Error();
  }
}

//profile page
export async function getEventsByWalletAddress(
  walletAddress: string,
  filter: IEventFilter,
  contentType: ContentType
): Promise<events[]> {
  const containFilter = filter.CREATED || filter.UPDATED || filter.LICENSING;
  try {
    const events = await prisma.events.findMany({
      where: {
        AND: [
          {
            ...(containFilter
              ? {
                  OR: [
                    {
                      ...(filter.CREATED
                        ? { eventType: EventType.CREATE }
                        : {}),
                    },
                    {
                      ...(filter.UPDATED
                        ? { eventType: EventType.UPDATED }
                        : {}),
                    },
                    {
                      ...(filter.LICENSING
                        ? { eventType: EventType.LICENSING }
                        : {}),
                    },
                  ],
                }
              : {}),
          },
          {
            OR: [
              {
                to: walletAddress,
              },
              {
                from: walletAddress,
              },
            ],
          },
          {
            content: {
              contentType: contentType,
            },
          },
        ],
      },
      include: {
        To: true,
        From: true,
        content: true,
      },
      orderBy: {
        timestamp: "desc",
      },
      skip: (filter.page - 1) * 15,
      take: 15,
    });
    return events;
  } catch (error) {
    console.log(error);
    throw new Error();
  }
}

//event on content detail page
export async function getEventsByContentId(
  id: number,
  page: number
): Promise<events[]> {
  try {
    const events = await prisma.events.findMany({
      where: {
        contentId: id,
      },
      include: {
        To: true,
        From: true,
      },
      orderBy: {
        timestamp: "desc",
      },
      skip: (page - 1) * 15,
      take: 15,
    });
    return events;
  } catch (error) {
    console.log(error);
    throw new Error();
  }
}

export function getEventsByTimestamp(
  timestamp: string,
  walletAdress: string
): Promise<events[]> {
  try {
    const events = prisma.events.findMany({
      where: {
        AND: [
          {
            timestamp: {
              lte: timestamp,
            },
          },
          {
            to: walletAdress,
          },
          {
            eventType: EventType.LICENSING,
          },
        ],
      },
      include: {
        From: true,
        content: true,
      },
    });
    return events;
  } catch (error) {
    console.log(error);
    throw new Error();
  }
}
