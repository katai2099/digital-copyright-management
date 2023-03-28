import { Link } from "react-router-dom";
import { IPFS_URL } from "../../constant";
import { UseDcm } from "../../contexts/UseDcm";
import { Content } from "../../model/Content";
import "./contentItems.css";

interface IContentItemProps {
  idx: number;
  content: Content;
}

export const ContentItem = ({ idx, content }: IContentItemProps) => {
  const { state } = UseDcm();
  return (
    <Link to={`/content/${content.pHash}`}>
      <div className="content-item">
        <div className="item-index">{idx}</div>
        <div className="item-img-wrapper">
          <img
            className="item-img"
            src={`${IPFS_URL}${content.IPFSAddress}`}
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
            <div className="item-price-ether">{content.price}</div>
          </div>
          <div className="item-price-fiat">{`(${
            content.price * state.coinRate.ETHToUSD
          }$)`}</div>
        </div>
      </div>
    </Link>
  );
};
