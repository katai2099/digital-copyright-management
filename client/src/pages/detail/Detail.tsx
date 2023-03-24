import { Link } from "react-router-dom";
import { Accordion } from "../../components/accordion/Accordion";
import "./detail.css";

export const Detail = () => {
  return (
    <div className="home-wrapper">
      <div className="digital-content-wrapper">
        <div className="left-block">
          <div className="digital-content-image-wrapper">
            <img
              className="digital-content-image"
              src="../../img/eth-diamond-purple-purple.png"
            />
          </div>
        </div>
        <div className="right-block">
          <div className="item-info-block">
            <div className="item-detail-title">TEST TEST TITLE</div>
            <div className="item-detail-owner">
              Owned by <Link to="#">katai</Link>
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
              <div className="item-detail-price-fiat">($12231)</div>
            </div>
            <button className="item-detail-button">Subscibe</button>
          </div>
        </div>
        <hr style={{ width: "100%", margin: "10px 16px" }} />
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
