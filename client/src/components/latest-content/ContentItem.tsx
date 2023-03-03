import { CopyrightImage } from "../../model/CopyrightImage";
import "./contentItem.css";

interface IContentShortInfoProps {
  idx: number;
  content: CopyrightImage;
}

export const ContentItem = () => {
  return (
    <a href="" style={{ textDecoration: "none" }}>
      <div className="content-item">
        <div className="item-index">1</div>
        <div className="item-img-wrapper">
          <img className="item-img" src=""></img>
        </div>
        <div className="item-info">
          <div className="item-title">Title</div>
          <div className="item-owner">Owner</div>
        </div>
        <div className="item-usage">
          <div className="item-price">122$</div>
          <div className="item-usage-type">one time used</div>
        </div>
      </div>
    </a>
  );
};
