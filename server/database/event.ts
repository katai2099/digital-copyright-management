import { contents, events } from "@prisma/client";
import { EventType, IEvent, IEventFilter } from "../models/Event";
import { prisma } from "./prisma";

export async function createEvent(event: IEvent) {
  try {
    const createEvent = await prisma.events.create({
      data: {
        contentId: event.contentId,
        transactionHash: event.transactionHash,
        eventType: event.eventType,
        from: event.from,
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

export async function getEvents(filter: IEventFilter): Promise<events[]> {
  const containFilter = filter.CREATED || filter.UPDATED || filter.LICENSING;
  try {
    const events = await prisma.events.findMany({
      ...(containFilter
        ? {
            where: {
              OR: [
                {
                  ...(filter.CREATED ? { eventType: EventType.CREATE } : {}),
                },
                {
                  ...(filter.UPDATED ? { eventType: EventType.UPDATED } : {}),
                },
                {
                  ...(filter.LICENSING
                    ? { eventType: EventType.LICENSING }
                    : {}),
                },
              ],
            },
            skip: (filter.page - 1) * 20,
            take: 15,
          }
        : {}),
    });
    return events;
  } catch (error) {
    console.log(error);
    throw new Error();
  }
}

export async function getEventsByContentId(id: number): Promise<events[]> {
  try {
    const events = await prisma.events.findMany({
      where: {
        contentId: id,
      },
      include: {
        content: true,
      },
      // orderBy : {

      // }
    });
    return events;
  } catch (error) {
    console.log(error);
    throw new Error();
  }
}

export async function getEventsByWalletAddress(
  walletAddress: string,
  filter: IEventFilter
): Promise<events[]> {
  try {
    const events = await prisma.events.findMany({});
    return events;
  } catch (error) {
    console.log(error);
    throw new Error();
  }
}
