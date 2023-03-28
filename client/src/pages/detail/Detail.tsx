import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Accordion } from "../../components/accordion/Accordion";
import { IPFS_URL } from "../../constant";
import { coinRateActions } from "../../contexts/state";
import { UseDcm } from "../../contexts/UseDcm";
import { getContentByHash } from "../../controllers/content";
import { getCoinRate } from "../../controllers/web3";
import { Content } from "../../model/Content";
import "./detail.css";

export const Detail = () => {
  const { state, dispatch } = UseDcm();
  const [content, setContent] = useState<Content>(new Content());
  const { hash } = useParams();
  console.log(hash);
  useEffect(() => {
    getCoinRate()
      .then((rate) => {
        dispatch({ type: coinRateActions.set, data: rate });
      })
      .then(() => getContentByHash(hash!))
      .then((ct: Content) => {
        setContent(ct);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [dispatch, hash]);

  return (
    <div className="home-wrapper">
      <div className="digital-content-wrapper">
        <div className="left-block">
          <div className="digital-content-image-wrapper">
            <img
              className="digital-content-image"
              src={`${IPFS_URL}${content.IPFSAddress}`}
              alt=""
            />
          </div>
        </div>
        <div className="right-block">
          <div className="item-info-block">
            <div className="item-detail-title">{content.title}</div>
            <div className="item-detail-owner">
              Owned by{" "}
              <Link to={`/profile/${content.ownerAddress}`}>katai</Link>
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
              <div className="item-detail-price-ether">0.03</div>
              <div className="item-detail-price-fiat">{`($${content.price})`}</div>
            </div>
            <button
              className="item-detail-button"
              onClick={() => {
                console.log(content);
              }}
            >
              Licensing
            </button>
          </div>
        </div>
        <hr style={{ width: "100%", margin: "16px 16px" }} />
        <div className="left-block">
          <Accordion title="Description">
            <div></div>
          </Accordion>
          <Accordion title="Pricing information">
            <div></div>
          </Accordion>
          <Accordion title="Detail">
            <div></div>
          </Accordion>
        </div>
        <div className="right-block">
          <Accordion title="Price History">
            <div></div>
          </Accordion>
        </div>
        <div className="full-block">
          <Accordion title="Activity">
            <div></div>
          </Accordion>
        </div>
      </div>
    </div>
  );
};
