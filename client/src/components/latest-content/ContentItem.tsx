import { Link } from "react-router-dom";
import { Content } from "../../model/Content";
import "./contentItems.css";

interface IContentItemProps {
  idx: number;
  content: Content;
}

export const ContentItem = ({ idx, content }: IContentItemProps) => {
  return (
    <Link to="/content">
      <div className="content-item">
        <div className="item-index">{idx}</div>
        <div className="item-img-wrapper">
          <img
            className="item-img"
            src={`https://ipfs.io/ipfs/${content.IPFSAddress}`}
            alt=""
          />
        </div>
        <div className="item-info">
          <div className="item-title">{content.title}</div>
          <div className="item-owner">{content.ownerName}</div>
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
          <div className="item-price-fiat">{`(${content.price})$`}</div>
        </div>
      </div>
    </Link>
  );
};
