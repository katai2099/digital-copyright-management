import "./eventTable.css";
import { Event } from "../../model/Event";
import { EtherIcon, SparkleIcon } from "../common/Icon";
import { EventType } from "../../model/Event";
import { getImageSrc } from "../../utils";
import { Content } from "../../model/Content";
import moment from "moment";

interface IEventTableProps {
  events: Event[];
  hasContent?: boolean;
}

export const EventTable = ({
  events,
  hasContent = false,
}: IEventTableProps) => {
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Event</th>
            {hasContent && <th>Content</th>}
            <th>Price</th>
            <th>From</th>
            <th>To</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr>
              <td className="no-wrap">
                {event.eventType === EventType.CREATE ? (
                  <SparkleIcon />
                ) : event.eventType === EventType.LICENSING ? (
                  <i className="las la-file-contract"></i>
                ) : (
                  <i className="las la-pen"></i>
                )}
                {`${event.eventType.slice(0, 1)}${event.eventType
                  .slice(1)
                  .toLowerCase()}`}
              </td>
              {hasContent && (
                <td className="no-wrap">
                  <div className="content-img-wrapper">
                    <img
                      className="content-img"
                      src={getImageSrc(event.content)}
                      width="56px"
                      height="56px"
                      alt=""
                    />
                  </div>
                  <div className="content-name">{event.content.desc}</div>
                </td>
              )}
              <td>
                <div>
                  <div className="ether-price-wrapper">
                    <EtherIcon />{" "}
                    <div className="ether-price">{event.price}</div>
                  </div>
                  <div className="fiat-price">($10.00)</div>
                </div>
              </td>
              <td className="no-wrap">
                <a href={`/profile/${event.from}`}>
                  {event.From.firstname + " " + event.From.lastname}
                </a>
              </td>
              <td className="no-wrap">
                <a href={`/profile/${event.to}`}>
                  {event.eventType === EventType.LICENSING
                    ? event.To.firstname + " " + event.To.lastname
                    : "-"}
                </a>
              </td>
              <td className="no-wrap">
                <a href="#">
                  {moment(new Date(Number(event.timestamp) * 1000)).fromNow()}
                  <i className="las la-external-link-alt"></i>
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
