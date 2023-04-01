import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Accordion } from "../../components/accordion/Accordion";
import { Modal } from "../../components/common/Modal";
import { ContentPriceInput } from "../../components/contentPriceInput/ContentPriceInput";
import { coinRateActions } from "../../contexts/state";
import { UseDcm } from "../../contexts/UseDcm";
import {
  getContentById,
  getContentEvents,
  licensingContent,
  updateContentPrice,
} from "../../controllers/content";
import { getCoinRate } from "../../controllers/web3";
import { Content } from "../../model/Content";
import { getImageSrc } from "../../utils";
import "./detail.css";
import { Event } from "../../model/Event";
import { EventTable } from "../../components/eventTable/EventTable";

export const Detail = () => {
  const { state, dispatch } = UseDcm();
  const [content, setContent] = useState<Content>(new Content());
  const [newPrice, setNewPrice] = useState<number>(0);
  const [events, setEvents] = useState<Event[]>([]);
  const [page, setPage] = useState<number>(1);
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    getCoinRate()
      .then((rate) => {
        dispatch({ type: coinRateActions.set, data: rate });
      })
      .then(() => getContentById(Number(id)))
      .then((content: Content) => {
        setContent(content);
        return content;
      })
      .catch((error) => {
        console.log(error);
      });
  }, [dispatch, id]);

  useEffect(() => {
    getContentEvents(Number(id), page)
      .then((events) => {
        console.log(events);
        setEvents(events);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id, page]);

  const price = state.web3State.web3?.utils.fromWei(
    content.price.toString(),
    "ether"
  );

  const updateButtonClickHandler = () => {
    updateContentPrice(content, newPrice, state)
      .then((res: any) => {
        console.log(res);
        // setContent({ ...content, price: newPrice });
        window.location.reload();
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  const licensingButtonHandler = () => {
    licensingContent(content, state)
      .then((res: any) => {
        console.log(res);
      })
      .catch((error: any) => {
        console.log(error);
      });
    // state.web3State.contract?.methods
    //   .contents(0)
    //   .call()
    //   .then((res: any) => {
    //     console.log(res);
    //   })
    //   .catch((error: any) => {
    //     console.log(error);
    //   });
  };

  const priceChangeHandler = (price: number) => {
    setNewPrice(price);
  };

  const isOwner = state.web3State.account === content.owner.walletAddress;

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
              <div className="item-detail-title">{content.title}</div>
              {isOwner && (
                <button
                  className="btn-edit"
                  onClick={() => setIsModalOpen(true)}
                >
                  Edit
                </button>
              )}
            </div>
            <div className="item-detail-owner">
              Owned by{" "}
              <Link to={`/profile/${content.owner.walletAddress}`}>
                {content.owner.firstname + " " + content.owner.lastname}
              </Link>
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
              <div className="item-detail-price-ether">{price}</div>
              <div className="item-detail-price-fiat">{`(${(
                Number(price) * state.coinRate.ETHToUSD
              ).toFixed(2)}$)`}</div>
            </div>
            {/* {!isOwner && ( */}
            <button
              className="item-detail-button"
              onClick={licensingButtonHandler}
            >
              Licensing
            </button>
            {/* )} */}
          </div>
        </div>
        <hr style={{ width: "100%", margin: "16px 16px" }} />
        <div className="left-block">
          <Accordion title="Description">
            <div>{content.desc}</div>
          </Accordion>
        </div>
        <div className="right-block">
          <Accordion title="Price History">
            <div>asdf</div>
          </Accordion>
        </div>
        <Modal
          title={"Please enter a new price"}
          open={isModalOpen}
          confirmTitle={"Update"}
          onClose={() => setIsModalOpen(false)}
          onConfirm={updateButtonClickHandler}
        >
          <ContentPriceInput
            onBlur={priceChangeHandler}
            ethToUsd={1803.61}
            usdToEth={0.0005544}
          />
        </Modal>

        <div className="full-block">
          <Accordion title="Activity">
            <div className="col-sm-12 activity-wrapper">
              <EventTable events={events} />
            </div>
          </Accordion>
        </div>
      </div>
    </div>
  );
};
