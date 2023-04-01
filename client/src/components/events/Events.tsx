import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Accordion } from "../accordion/Accordion";
import { IContentTypeProps } from "../contents/Contents";
import "./events.css";
import { EventTable } from "../eventTable/EventTable";
export const Events = ({ contentType }: IContentTypeProps) => {
  const type = contentType;
  return (
    <div className="row">
      <div className="col-sm-3">
        <Accordion title="Event Type">
          <div className="event-type">
            <label htmlFor="event">Create</label>
            <input type="checkbox" name="event" />
          </div>
          <div className="event-type">
            <label htmlFor="event">Agreement</label>
            <input type="checkbox" name="event" />
          </div>
          <div className="event-type">
            <label htmlFor="event">Update</label>
            <input type="checkbox" name="event" />
          </div>
        </Accordion>
      </div>
      <div className="col-sm-9">{/* <EventTable /> */}</div>
    </div>
  );
};
