import { Content } from "../../model/Content";
import { ContentItem } from "./ContentItem";
import "./contentItems.css";

interface IContentItemsProps {
  title: string;
  contents: Content[];
  columnNumber: number;
}

export const ContentItems = ({
  title,
  contents,
  columnNumber,
}: IContentItemsProps) => {
  return (
    <div className="latest-content-column">
      <div className="column-header">
        <div className="header-index">#</div>
        <div className="header-name">{title}</div>
        <div className="header-price">Price</div>
      </div>
      {contents.map((content, idx) => (
        <ContentItem
          key={columnNumber * 5 + idx + 1}
          idx={columnNumber * 5 + idx + 1}
          content={content}
        ></ContentItem>
      ))}
    </div>
  );
};
