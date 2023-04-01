import { Link, useNavigate } from "react-router-dom";
import { IPFS_URL } from "../../constant";
import { UseDcm } from "../../contexts/UseDcm";
import { Content } from "../../model/Content";
import { getImageSrc } from "../../utils";
import { Card } from "../common/Card";
import "./contentSummary.css";

interface IContentSummaryProps {
  content: Content;
}

export const ContentSummary = ({ content }: IContentSummaryProps) => {
  const { state } = UseDcm();

  const price = state.web3State.web3?.utils.fromWei(
    content.price.toString(),
    "ether"
  );

  const navigate = useNavigate();

  const summaryClickHandler = () => {
    navigate(`/content/${content.pHash}`);
  };

  return (
    <Card>
      <Link className="content-summary-item" to={`/content/${content.id}`}>
        <div className="content-image-wrapper">
          <img className="content-image" src={getImageSrc(content)} alt="" />
        </div>
        <div className="content-info-wrapper">
          <div className="content-info">
            <div className="content-title">{content.title}</div>
            <div className="content-hash">{content.pHash}</div>
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
            <div className="ether">{price}</div>
            <div className="fiat">{`(${(
              Number(price) * state.coinRate.ETHToUSD
            ).toFixed(2)}$)`}</div>
          </div>
          <div className="content-owner">
            <p>
              Owned by{" "}
              <Link to="/profile" className="link">
                {content.owner.firstname + " " + content.owner.lastname}
              </Link>
            </p>
          </div>
        </div>
      </Link>
    </Card>
  );
};
