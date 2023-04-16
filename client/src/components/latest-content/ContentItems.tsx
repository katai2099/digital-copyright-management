import { Content } from "../../model/Content";
import { ContentItem, ContentItemSkeletonLoading } from "./ContentItem";
import "./contentItems.css";

interface IContentItemsProps {
  title: string;
  contents: Content[];
  columnNumber: number;
  loading: boolean;
  all: boolean;
}

export const ContentItems = ({
  title,
  contents,
  columnNumber,
  loading,
  all,
}: IContentItemsProps) => {
  return (
    <div className="latest-content-column">
      <div className="column-header">
        <div className="header-index">#</div>
        <div className="header-name">{title}</div>
        <div className="header-price">Price</div>
      </div>
      {loading && <ContentItemSkeletonLoading />}
      {contents.map((content, idx) => (
        <ContentItem
          key={columnNumber * 5 + idx + 1}
          idx={all ? idx + 1 : columnNumber * 5 + idx + 1}
          content={content}
        ></ContentItem>
      ))}
      {!loading && contents.length === 0 && (
        <div className="no-contents">No Contents</div>
      )}
    </div>
  );
};
