import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ContentSummary } from "../../components/contentSummary/ContentSummary";
import { FilterArea } from "../../components/filterArea/filterArea";
import { FilterBar } from "../../components/filterBar/FilterBar";
import { contentFiltersWithIcon } from "../../constant";
import { ContentType } from "../../model/Content";
import "./explore.css";

export const Explore = () => {
  return (
    <div className="home-wrapper">
      <div className="explore-header">
        <h3 style={{ color: "#000" }}>Explore Contents</h3>
      </div>
      <FilterBar
        options={contentFiltersWithIcon}
        inputName="content-filter"
        onClicked={(value) => {
          console.log(value as ContentType);
        }}
      />
      <div className="content-area">
        <div className="filter-area">
          <FilterArea />
          <div className="filter-separator" />
        </div>
        <div className="content-lists-area">
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
            <ContentSummary />
            <ContentSummary />
            <ContentSummary />
          </div>
        </div>
      </div>
    </div>
  );
};
