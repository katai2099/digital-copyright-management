import { Link } from "react-router-dom";
import { Card } from "../common/Card";
import "./contentSummary.css";

export const ContentSummary = () => {
  return (
    <Card>
      <Link className="content-summary-item" to="/content">
        <div className="content-image-wrapper">
          <img
            className="content-image"
            src="../../img/eth-diamond-purple-purple.png"
            // icons8-upload-100.png
            // eth-diamond-purple.png
            alt="content"
          />
        </div>
        <div className="content-info-wrapper">
          <div className="content-info">
            <Link to="/content" className="content-title">
              Title
            </Link>
            <div className="content-hash">213123x87ads</div>
          </div>
          <div className="content-price-wrapper">
            <i>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
                className="eth-cur-icon"
              >
                <path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z" />
              </svg>
            </i>{" "}
            <div className="ether">0.03</div>
            <div className="fiat">(199$)</div>
          </div>
          <div className="content-owner">
            <p>
              Owned by{" "}
              <Link to="/profile" className="link">
                katai
              </Link>
            </p>
          </div>
        </div>
      </Link>
    </Card>
  );
};
