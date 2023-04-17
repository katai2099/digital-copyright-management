import "./eventTable.css";
import { Event } from "../../model/Event";
import { EtherIcon, SparkleIcon } from "../common/Icon";
import { EventType } from "../../model/Event";
import { fromWei, getImageSrc } from "../../utils";
import { BaseContent, Content } from "../../model/Content";
import moment from "moment";
import { UseDcm } from "../../contexts/UseDcm";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { ClipLoader } from "react-spinners";

interface IEventTableProps {
  events: Event[];
  fetching: boolean;
  hasContent?: boolean;
  endOfPage: boolean;
  fetchMoreContent: boolean;
  noEvent?: boolean;
  pageChangeHandler: () => void;
}

export const EventTable = ({
  events,
  fetching,
  hasContent = false,
  endOfPage,
  fetchMoreContent,
  noEvent,
  pageChangeHandler,
}: IEventTableProps) => {
  const { state } = UseDcm();
  return (
    <div className="event-table">
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
          {fetching && (
            <>
              {Array(hasContent ? 9 : 5)
                .fill(0)
                .map(() => (
                  <tr>
                    <td>
                      <Skeleton />
                    </td>
                    <td>
                      <Skeleton />
                    </td>
                    <td>
                      <Skeleton />
                    </td>
                    <td>
                      <Skeleton />
                    </td>
                    <td>
                      <Skeleton />
                    </td>
                    {hasContent && (
                      <td>
                        <Skeleton />
                      </td>
                    )}
                  </tr>
                ))}
            </>
          )}
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
                  <ContentPreviewComponent content={event.content} />
                </td>
              )}
              <td>
                <div>
                  <div className="ether-price-wrapper">
                    <EtherIcon />{" "}
                    <div className="ether-price">
                      {fromWei(event.price.toString(), state)}
                    </div>
                  </div>
                  <div className="fiat-price">{`($${(
                    Number(fromWei(event.price.toString(), state)) *
                    state.coinRate.ETHToUSD
                  ).toFixed(2)})`}</div>
                </div>
              </td>
              <td className="no-wrap">
                <Link to={`/profile/${event.from}`}>
                  {event.From.firstname + " " + event.From.lastname}
                </Link>
              </td>
              <td className="no-wrap">
                {event.eventType === EventType.LICENSING ? (
                  <Link to={`/profile/${event.to}`}>
                    {event.To.firstname + " " + event.To.lastname}
                  </Link>
                ) : (
                  "-"
                )}
              </td>
              <td className="no-wrap">
                <Link to="#">
                  {moment(new Date(Number(event.timestamp) * 1000)).fromNow()}
                  <i className="las la-external-link-alt link-icon"></i>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!fetching && noEvent ? (
        <div className="no-contents">No events</div>
      ) : (
        <div>
          <div className="btn-load-more-wrapper">
            {!endOfPage && !fetchMoreContent && !fetching && (
              <button
                className="btn-explore btn-load-more"
                onClick={pageChangeHandler}
              >
                Load more
              </button>
            )}
          </div>
          {endOfPage && (
            <div className="end-of-contents-text">You have reached the end</div>
          )}
        </div>
      )}
      {fetchMoreContent && (
        <div style={{ margin: "10px 0", textAlign: "center" }}>
          <ClipLoader
            color="#88a9ea"
            size={50}
            loading={true}
            speedMultiplier={0.9}
          />
        </div>
      )}
    </div>
  );
};

interface IContentPreviewProps {
  content: BaseContent | Content;
}

export const ContentPreviewComponent = ({ content }: IContentPreviewProps) => {
  return (
    <Link to={`/content/${content.id}`}>
      <div className="d-flex align-items-center">
        <div className="content-img-wrapper">
          <img
            className="content-img"
            src={getImageSrc(content)}
            width="56px"
            height="56px"
            alt=""
          />
        </div>
        <div className="content-name">{content.title}</div>
      </div>
    </Link>
  );
};
