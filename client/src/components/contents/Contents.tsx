import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ContentType } from "../../model/Content";
import { ContentSummary } from "../contentSummary/ContentSummary";
import { FilterArea } from "../filterArea/filterArea";

export interface IContentTypeProps {
  contentType: ContentType;
}

export const Contents = ({ contentType }: IContentTypeProps) => {
  const type = contentType;
  return (
    <div className="row">
      <div className="col-sm-3">
        <FilterArea />
        <div className="filter-separator" />
      </div>
      <div className="col-sm-9">
        <div className="explore-input-wrapper">
          <div className="input-icon">
            <i>
              <FontAwesomeIcon icon={faSearch} />
            </i>
          </div>
          <input className="explore-input" />
        </div>
        <div className="contents-grid">
          <ContentSummary />
          <ContentSummary />
          <ContentSummary />
        </div>
      </div>
    </div>
  );
};
