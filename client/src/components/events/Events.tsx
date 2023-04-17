import { Accordion } from "../accordion/Accordion";
import "./events.css";
import { EventTable } from "../eventTable/EventTable";
import { useEffect, useState } from "react";
import { Event } from "../../model/Event";
import { getUserEvents } from "../../controllers/event";
import { ContentType } from "../../model/Content";
import { usePrevious } from "../../hooks/usePrevious";

export interface IEventProps {
  contentType: ContentType;
  walletAddress: string;
}

export const Events = ({ contentType, walletAddress }: IEventProps) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [page, setPage] = useState<number>(1);
  const [checkedState, setChecked] = useState<boolean[]>(
    new Array(3).fill(false)
  );
  const [fetching, setFetching] = useState<boolean>(false);
  const type = contentType;
  const [endOfPage, setEndOfPage] = useState<boolean>(false);
  const [fetchMoreContent, setFetchMoreContent] = useState<boolean>(false);
  const [noEvent, setNoEvent] = useState<boolean>(false);

  const prevContentType = usePrevious(type);

  const pageChangeHandler = () => {
    setFetchMoreContent(true);
    setPage((oldValue) => oldValue + 1);
  };

  useEffect(() => {
    if (page === 1) setFetching(true);
    getUserEvents(type, page, checkedState, walletAddress)
      .then((newEvents) => {
        setFetching(false);
        if (page === 1 && newEvents.length === 0) {
          setNoEvent(true);
        }
        if (page !== 1) {
          setEvents((prevEvents) => [...prevEvents, ...newEvents]);
        } else {
          setEvents(newEvents);
        }
        if (
          page !== 1 &&
          newEvents.length === 0 &&
          (prevContentType as ContentType) === type
        ) {
          setEndOfPage(true);
        }

        if ((prevContentType as ContentType) !== type) {
          setEndOfPage(false);
          setPage(1);
          setNoEvent(false);
        }
        setFetchMoreContent(false);
      })
      .catch((error) => {
        console.log(error);
        setFetching(false);
        setFetchMoreContent(false);
      });
  }, [checkedState, page, prevContentType, type, walletAddress]);
  const onChangeHandler = (pos: number) => {
    const updatedCheckedSate = checkedState.map((item, idx) =>
      idx === pos ? !item : item
    );
    console.log(updatedCheckedSate);
    setChecked(updatedCheckedSate);
    setPage(1);
    setEndOfPage(false);
    setNoEvent(false);
  };

  return (
    <div className="row">
      <div className="col-sm-3">
        <Accordion title="Event Type">
          <div className="event-type">
            <label htmlFor="event-1">Create</label>
            <input
              id="event-1"
              type="checkbox"
              name="event"
              onChange={() => onChangeHandler(0)}
            />
          </div>
          <div className="event-type">
            <label htmlFor="event-2">Licensing</label>
            <input
              id="event-2"
              type="checkbox"
              name="event"
              onChange={() => onChangeHandler(1)}
            />
          </div>
          <div className="event-type">
            <label htmlFor="event-3">Update</label>
            <input
              id="event-3"
              type="checkbox"
              name="event"
              onChange={() => onChangeHandler(2)}
            />
          </div>
        </Accordion>
      </div>
      <div className="col-sm-9">
        <EventTable
          events={events}
          hasContent={true}
          fetching={fetching}
          endOfPage={endOfPage}
          fetchMoreContent={fetchMoreContent}
          noEvent={noEvent}
          pageChangeHandler={() => {
            pageChangeHandler();
          }}
        />
      </div>
    </div>
  );
};
