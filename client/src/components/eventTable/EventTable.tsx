import "./eventTable.css";
import { Event } from "../../model/Event";
import { EtherIcon, SparkleIcon } from "../common/Icon";
import { EventType } from "../../model/Event";

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
                      src="./img/blockchain.png"
                      width="56px"
                      height="56px"
                    />
                  </div>
                  <div className="content-name">this is my pic</div>
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
                  {event.To.firstname + " " + event.To.lastname}
                </a>
              </td>
              <td className="no-wrap">
                <a href="#">
                  {event.timestamp} <i className="las la-external-link-alt"></i>
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
