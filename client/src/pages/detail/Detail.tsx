import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Accordion } from "../../components/accordion/Accordion";
import { Modal, RequestInfoModal } from "../../components/common/Modal";
import { ContentPriceInput } from "../../components/contentPriceInput/ContentPriceInput";
import { coinRateActions } from "../../contexts/state";
import { UseDcm } from "../../contexts/UseDcm";
import {
  getContentById,
  getContentEvents,
  requestContent,
  updateContentData,
} from "../../controllers/content";
import { getCoinRate, getCurrentUsdToEth } from "../../controllers/web3";
import { Content } from "../../model/Content";
import { fromWei, getImageSrc } from "../../utils";
import "./detail.css";
import { Event } from "../../model/Event";
import { EventTable } from "../../components/eventTable/EventTable";
import { RequestType } from "../../model/Request";
import Skeleton from "react-loading-skeleton";

export const Detail = () => {
  const { state, dispatch } = UseDcm();
  const { id } = useParams();
  const [content, setContent] = useState<Content>(new Content());
  const [events, setEvents] = useState<Event[]>([]);
  const [page, setPage] = useState<number>(1);
  const [isLicensing, setIsLicensing] = useState<boolean>(false);
  //editModal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentUsdToEth, setCurrentUsdToEth] = useState<number>(0);
  const [isConfirmUI, setIsConfirmUI] = useState<boolean>(false);
  const [newPrice, setNewPrice] = useState<number>(0);
  const [newFieldOfUse, setNewFieldOfUse] = useState<string>("");

  //request modal
  const [requestModalOpen, setRequestModalOpen] = useState<boolean>(false);
  const [reasonOfUse, setReasonOfUse] = useState<string>("");
  const [fieldOfUse, setFieldOfUse] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(false);
  const [fetchingUser, setFetchingUser] = useState<boolean>(false);

  useEffect(() => {
    getCoinRate().then((rate) => {
      dispatch({ type: coinRateActions.set, data: rate });
    });
  }, [dispatch]);

  useEffect(() => {
    setFetchingUser(true);
    getContentById(Number(id))
      .then((content: Content) => {
        setContent(content);
        setFetchingUser(false);

        return content;
      })
      .catch((error) => {
        setFetchingUser(false);
        console.log(error);
      });
  }, [dispatch, id]);

  useEffect(() => {
    setFetching(true);

    getContentEvents(Number(id), page)
      .then((events) => {
        console.log(events);
        setEvents(events);
        setFetching(false);
      })
      .catch((error) => {
        console.log(error);
        setFetching(false);
      });
  }, [id, page]);

  const price = fromWei(content.price.toString(), state);

  const updateButtonClickHandler = () => {
    setIsConfirmUI(true);
    getCurrentUsdToEth()
      .then((res) => {
        setCurrentUsdToEth(Number(res));
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const confirmButtonClickHandler = () => {
    updateContentData(content, newPrice, state, newFieldOfUse, currentUsdToEth)
      .then((res: any) => {
        console.log(res);
        // setContent({ ...content, price: newPrice });
        window.location.reload();
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  const requestButtonHandler = () => {
    if (reasonOfUse === "") {
      setIsError(true);
      return;
    }
    requestContent(content, state, reasonOfUse, fieldOfUse)
      .then((res: any) => {
        console.log(res);
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  const isOwner = state.web3State.account === content.owner.walletAddress;
  const isPending = content.requests.some(
    (entry) =>
      entry.contentId === Number(id) &&
      entry.licensee === state.web3State.account &&
      entry.requestType === RequestType.PENDING
  );

  return (
    <div className="home-wrapper">
      <div className="digital-content-wrapper">
        <div className="left-block">
          <div className="digital-content-image-wrapper">
            <img
              className="digital-content-image"
              src={getImageSrc(content)}
              alt=""
            />
          </div>
        </div>
        <div className="right-block">
          <div className="item-info-block">
            <div className="content-control-area">
              <div className="item-detail-title">
                {fetchingUser ? <Skeleton width={550} /> : `${content.title}`}
              </div>
              {isOwner && (
                <button className="btn" onClick={() => setIsModalOpen(true)}>
                  <i className="lar la-edit edit-button"></i>
                </button>
              )}
            </div>
            <div className="item-detail-owner">
              Owned by{" "}
              {fetchingUser ? (
                <div style={{ display: "inline-block" }} className="col-sm-8">
                  <Skeleton height={10} />
                </div>
              ) : (
                <Link to={`/profile/${content.owner.walletAddress}`}>
                  {content.owner.firstname + " " + content.owner.lastname}
                </Link>
              )}
            </div>
            <div className="item-detail-price">Price</div>
            <div className="item-detail-price-wrapper">
              <i>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 320 512"
                  className="price-ether-icon"
                >
                  <path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z" />
                </svg>
              </i>{" "}
              {fetchingUser ? (
                <div style={{ display: "inline-block" }} className="col-sm-8">
                  <Skeleton height={48} />
                </div>
              ) : (
                <>
                  <div className="item-detail-price-ether">{price}</div>
                  <div className="item-detail-price-fiat">{`(${(
                    Number(price) * state.coinRate.ETHToUSD
                  ).toFixed(2)}$)`}</div>
                </>
              )}
            </div>

            <button
              title={isOwner ? "You are the owner" : ""}
              className="item-detail-button"
              onClick={() => setRequestModalOpen(true)}
              disabled={isPending || isOwner}
            >
              {isPending ? "Pending" : "Request"}
            </button>
          </div>
        </div>
        <hr style={{ width: "100%", margin: "16px 16px" }} />
        <div className="left-block">
          <Accordion title="Description" isOpen={true}>
            <div>{content.desc}</div>
          </Accordion>
        </div>
        <div className="right-block">
          <Accordion title="Price History">
            <div>asdf</div>
          </Accordion>
        </div>

        <Modal
          title={isConfirmUI ? "Confirmation" : "Please enter a new data"}
          open={isModalOpen}
          confirmTitle={isConfirmUI ? "Confirm" : "Next"}
          onClose={() => {
            if (isConfirmUI) {
              setIsConfirmUI(false);
            } else {
              setIsModalOpen(false);
              setNewPrice(0);
              setNewFieldOfUse("");
            }
          }}
          closeTitle={isConfirmUI ? "Back" : "Close"}
          onConfirm={
            isConfirmUI ? confirmButtonClickHandler : updateButtonClickHandler
          }
          onXMarkClose={() => {
            setIsConfirmUI(false);
            setIsModalOpen(false);
            setNewPrice(0);
            setNewFieldOfUse("");
          }}
          extraZ={true}
        >
          <div className="detail-page-modal px-4">
            {isConfirmUI ? (
              <div>
                <div>{`The final price for your content in Eth is ${
                  currentUsdToEth * newPrice
                }`}</div>
                <div>{`Current USD to ETH rate is ${currentUsdToEth}`}</div>
              </div>
            ) : (
              <>
                <legend className="w-auto ">Copyright info</legend>
                <ContentPriceInput
                  onChange={(price: number) => {
                    setNewPrice(price);
                  }}
                  ethToUsd={state.coinRate.ETHToUSD}
                  usdToEth={state.coinRate.USDToETH}
                  onConvert={(price: number) => {
                    setNewPrice(price);
                  }}
                  isModal={true}
                />
                <label>Field of use</label>
                <textarea
                  placeholder="Usually define the scope of license covered and its restriction"
                  rows={6}
                  onChange={(event) => {
                    setNewFieldOfUse(event.currentTarget.value);
                  }}
                />
              </>
            )}
          </div>
        </Modal>
        <Modal
          title={"Please enter request info"}
          open={requestModalOpen}
          onClose={() => {
            setIsError(false);
            setReasonOfUse("");
            setFieldOfUse("");
            setRequestModalOpen(false);
          }}
          confirmTitle="Submit"
          onConfirm={requestButtonHandler}
        >
          <RequestInfoModal
            onReasonChange={(reason: string) => {
              if (reason !== "") {
                setIsError(false);
              }
              setReasonOfUse(reason);
            }}
            onFieldOfUseChange={(field: string) => {
              setFieldOfUse(field);
            }}
            isError={isError}
          />
        </Modal>
        <div className="full-block">
          <Accordion title="Activity">
            <div className="col-sm-12 activity-wrapper">
              <EventTable events={events} fetching={fetching} />
            </div>
          </Accordion>
        </div>
      </div>
    </div>
  );
};
