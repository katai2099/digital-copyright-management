import { Card } from "../common/Card";
import "./contentSummary.css";

export const ContentSummary = () => {
  return (
    <Card>
      <a className="content-summary-item" href="#">
        <div className="content-image-wrapper">
          <img
            className="content-image"
            src="../../img/blockchain.png"
            // icons8-upload-100.png
            alt="content"
          />
        </div>
        <div className="content-info-wrapper">
          <div className="content-info">
            <h4 className="content-title">Title</h4>
            <p className="content-price">Price</p>
            <p className="content-hash">Hash</p>
          </div>
          <div className="content-owner">
            <p>
              Owned by <strong>katai</strong>
            </p>
          </div>
        </div>
      </a>
    </Card>
  );
};
