import { Accordion } from "../accordion/Accordion";
import "./events.css";
import { EventTable } from "../eventTable/EventTable";
import { useEffect, useState } from "react";
import { Event } from "../../model/Event";
import { getUserEvents } from "../../controllers/event";
import { ContentType } from "../../model/Content";

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
  const type = contentType;
  useEffect(() => {
    getUserEvents(type, page, checkedState, walletAddress)
      .then((events) => {
        setEvents(events);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [checkedState, page, type, walletAddress]);
  const onChangeHandler = (pos: number) => {
    const updatedCheckedSate = checkedState.map((item, idx) =>
      idx === pos ? !item : item
    );
    console.log(updatedCheckedSate);
    setChecked(updatedCheckedSate);
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
        <EventTable events={events} hasContent={true} />
      </div>
    </div>
  );
};
