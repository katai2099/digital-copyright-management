import { EVENT_ROUTE } from "../constant";
import { ContentType } from "../model/Content";
import { Event } from "../model/Event";
import { getRequest } from "./clientRequest";

export function getEventsByContentId(id: number) {}

function getEventsByContentIdWorker(id: number) {
  // return getRequest<>()
}

export function getUserEvents(
  contentType: ContentType,
  page: number,
  checkedState: boolean[],
  address: string
): Promise<Event[]> {
  return getUserEventsWorker(contentType, page, checkedState, address)
    .then((events) => Promise.resolve(events))
    .catch((error) => Promise.reject(error));
}

function getUserEventsWorker(
  contentType: ContentType,
  page: number,
  checkedState: boolean[],
  address: string
): Promise<Event[]> {
  return getRequest<Event[]>(`${EVENT_ROUTE}/user/`, {
    CREATED: checkedState[0],
    LICENSING: checkedState[1],
    UPDATED: checkedState[2],
    page: page,
    content: contentType,
    address: address,
  })
    .then((events) => Promise.resolve(events))
    .catch((error) => Promise.reject(error));
}
