import { Link } from "react-router-dom";
import { CopyrightImage } from "../../model/CopyrightImage";
import "./contentItems.css";

interface IContentShortInfoProps {
  idx: number;
  content: CopyrightImage;
}

export const ContentItem = () => {
  return (
    <Link to="/content">
      <div className="content-item">
        <div className="item-index">1</div>
        <div className="item-img-wrapper">
          <img
            className="item-img"
            src="../../img/eth-diamond-purple-purple.png"
          ></img>
        </div>
        <div className="item-info">
          <div className="item-title">Title</div>
          <div className="item-owner">Owner</div>
        </div>
        <div className="item-usage">
          <div>
            <i>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
                className="price-ether-icon"
              >
                <path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z" />
              </svg>
            </i>{" "}
            <div className="item-price-ether">0.03</div>
          </div>
          <div className="item-price-fiat">(123$)</div>
        </div>
      </div>
    </Link>
  );
};
