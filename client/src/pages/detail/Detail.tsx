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
import { fromWei, getImageSrc, handleError } from "../../utils";
import "./detail.css";
import { Event, EventType } from "../../model/Event";
import { EventTable } from "../../components/eventTable/EventTable";
import { BaseRequest, Request, RequestType } from "../../model/Request";
import Skeleton from "react-loading-skeleton";
import { toast } from "react-toastify";
import { EthereumPriceWrapper } from "../../components/common/Common";
import { ContentZoom } from "../../components/contentZoom/ContentZoom";
import { ClipLoader } from "react-spinners";

export const Detail = () => {
  const { state, dispatch } = UseDcm();
  const { id } = useParams();
  const [content, setContent] = useState<Content>(new Content());
  const [events, setEvents] = useState<Event[]>([]);
  const [page, setPage] = useState<number>(1);
  const [endOfPage, setEndOfPage] = useState<boolean>(false);
  const [fetchMoreContent, setFetchMoreContent] = useState<boolean>(false);

  //editModal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentUsdToEth, setCurrentUsdToEth] = useState<number>(0);
  const [isConfirmUI, setIsConfirmUI] = useState<boolean>(false);
  const [newPrice, setNewPrice] = useState<number>(0);
  const [newFieldOfUse, setNewFieldOfUse] = useState<string>("");
  const [fullscreen, setFullscreen] = useState<boolean>(false);

  //request modal
  const [requestModalOpen, setRequestModalOpen] = useState<boolean>(false);
  const [reasonOfUse, setReasonOfUse] = useState<string>("");
  const [fieldOfUse, setFieldOfUse] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(false);
  const [fetchingUser, setFetchingUser] = useState<boolean>(false);

  const [fetchingEtherPrice, setFetchingEtherPrice] = useState<boolean>(false);

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

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
    if (page === 1) setFetching(true);
    getContentEvents(Number(id), page)
      .then((newEvents) => {
        console.log(newEvents);
        setFetching(false);
        if (page !== 1) {
          setEvents((prevEvents) => [...prevEvents, ...newEvents]);
        } else {
          setEvents(newEvents);
        }
        if (page !== 1 && newEvents.length === 0) {
          setEndOfPage(true);
        }
        setFetchMoreContent(false);
      })
      .catch((error) => {
        console.log(error);
        setFetching(false);
      });
  }, [id, page]);

  const pageChangeHandler = () => {
    setFetchMoreContent(true);
    setPage((oldValue) => oldValue + 1);
  };

  const price = fromWei(content.price.toString(), state);

  const updateButtonClickHandler = () => {
    setIsConfirmUI(true);
    setFetchingEtherPrice(true);
    getCurrentUsdToEth()
      .then((res) => {
        setCurrentUsdToEth(Number(res));
        setFetchingEtherPrice(false);
      })
      .catch((error) => {
        setFetchingEtherPrice(false);
        handleError(error);
        console.log(error);
      });
  };
  const confirmButtonClickHandler = () => {
    setIsModalOpen(false);
    setIsConfirmUI(false);
    updateContentData(
      content,
      newPrice,
      state,
      newFieldOfUse,
      currentUsdToEth,
      dispatch
    )
      .then((res: any) => {
        setContent({
          ...content,
          price: state.web3State.web3?.utils.toWei(
            (newPrice * currentUsdToEth).toString()
          )!,
          fieldOfUse: newFieldOfUse === "" ? content.fieldOfUse : newFieldOfUse,
        });
        toast.success("Update successfully");
      })
      .catch((error: any) => {
        handleError(error);
        console.log(error);
      });
  };

  const requestButtonHandler = () => {
    if (reasonOfUse === "") {
      setIsError(true);
      return;
    }
    setRequestModalOpen(false);
    requestContent(content, state, reasonOfUse, fieldOfUse, dispatch)
      .then((res: BaseRequest) => {
        console.log(res);
        toast.success("Request sent sucessfully");
        const tmpRequest = [
          new Request(
            res.id,
            res.licensee,
            res.contentId,
            res.purposeOfUse,
            res.fieldOfUse,
            res.price,
            res.requestType,
            res.timestamp
          ),
        ];
        setContent({ ...content, requests: tmpRequest });
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
  const isAccepted = content.requests.some(
    (entry) =>
      entry.contentId === Number(id) &&
      entry.licensee === state.web3State.account &&
      entry.requestType === RequestType.APPROVED
  );

  const agreementRequest = content.requests.find(
    (entry) =>
      entry.contentId === Number(id) &&
      entry.licensee === state.web3State.account &&
      entry.requestType === RequestType.APPROVED
  );

  const priceHistory = events.filter(
    (event) =>
      event.eventType === EventType.CREATE ||
      event.eventType === EventType.UPDATED
  );

  return (
    <div className="home-wrapper">
      <ContentZoom
        open={fullscreen}
        onClose={() => setFullscreen(false)}
        contentType={content.contentType}
        fileUrl={content.IPFSAddress}
      />

      <div className="digital-content-wrapper">
        <div className="left-block">
          <div className="digital-content-image-wrapper">
            <div className="circle">
              <i
                className="las la-search-plus zoom-content-detail"
                onClick={() => setFullscreen(true)}
              />
            </div>
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
              title={
                isOwner
                  ? "You are the owner"
                  : isAccepted
                  ? "Your request has been accepted"
                  : ""
              }
              className="item-detail-button"
              onClick={() => setRequestModalOpen(true)}
              disabled={isPending || isOwner || isAccepted}
            >
              {isPending ? "Pending" : isAccepted ? "Accepted" : "Request"}
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
            <div className="row">
              <div className="row">
                <div className="col-sm-6 agreement-block-title">Date:</div>
                <div className="col-sm-6 agreement-block-title">Price:</div>
              </div>

              {priceHistory.map((price) => (
                <div className="row">
                  <div className="col-sm-6">{`${new Date(
                    Number(price.timestamp) * 1000
                  ).toDateString()}`}</div>
                  <div className="col-sm-6">
                    <EthereumPriceWrapper
                      ether={fromWei(price.price.toString(), state)}
                      fiat={(
                        Number(fromWei(price.price.toString(), state)) *
                        state.coinRate.ETHToUSD
                      ).toFixed(2)}
                      horizontal={true}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Accordion>
        </div>
        <div className="left-block">
          <Accordion title="Field of use" isOpen={false}>
            <div>{content.fieldOfUse}</div>
          </Accordion>
        </div>
        {agreementRequest && (
          <div className="right-block">
            <Accordion title="Agreement" isOpen={false}>
              <div className="agreement-block">
                <div>
                  <div className="agreement-block-title">Date: &nbsp;</div>
                  <div className="agreement-block-info">{`${new Date(
                    Number(agreementRequest.timestamp) * 1000
                  ).toDateString()}`}</div>
                </div>
                <div className="agreement-block-price-wrapper">
                  <div className="agreement-block-title">Price: &nbsp;</div>
                  <div className="agreement-block-info">
                    <EthereumPriceWrapper
                      ether={fromWei(agreementRequest.price.toString(), state)}
                      fiat={(
                        Number(
                          fromWei(agreementRequest.price.toString(), state)
                        ) * state.coinRate.ETHToUSD
                      ).toFixed(2)}
                      horizontal={true}
                    />
                  </div>
                </div>
                <div>
                  <div className="agreement-block-title">
                    Reason of use: &nbsp;
                  </div>
                  <div className="agreement-block-info">
                    {agreementRequest.purposeOfUse}
                  </div>
                </div>
                <div>
                  <div className="agreement-block-title">
                    Field of use: &nbsp;
                  </div>
                  <div className="agreement-block-info">
                    {agreementRequest.fieldOfUse !== ""
                      ? agreementRequest.fieldOfUse
                      : content.fieldOfUse}
                  </div>
                </div>
              </div>
            </Accordion>
          </div>
        )}

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
          {fetchingEtherPrice ? (
            <div style={{ margin: "10px 0", textAlign: "center" }}>
              <ClipLoader
                color="#88a9ea"
                size={50}
                loading={true}
                speedMultiplier={0.9}
              />
            </div>
          ) : (
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
          )}
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
              <EventTable
                events={events}
                fetching={fetching}
                endOfPage={endOfPage}
                fetchMoreContent={fetchMoreContent}
                pageChangeHandler={() => {
                  pageChangeHandler();
                }}
              />
            </div>
          </Accordion>
        </div>
      </div>
    </div>
  );
};
