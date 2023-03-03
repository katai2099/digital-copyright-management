import { ContentItem } from "./ContentItem";
import "./contentItems.css";

export const ContentItems = () => {
  return (
    <div className="latest-content-column">
      <div className="column-header">
        <div className="header-index">#</div>
        <div className="header-name">Image</div>
        <div className="header-price">Price</div>
      </div>
      <ContentItem />
      <ContentItem />
      <ContentItem />
      <ContentItem />
      <ContentItem />
    </div>
  );
};
