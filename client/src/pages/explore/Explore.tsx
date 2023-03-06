import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card } from "../../components/common/Card";
import { ContentSummary } from "../../components/contentSummary/ContentSummary";
import { FilterArea } from "../../components/filterArea/filterArea";
import "./explore.css";

export const Explore = () => {
  return (
    <div className="home-wrapper">
      <div className="explore-header">
        <h3 style={{ color: "#000" }}>Explore</h3>
      </div>
      <div className="explore-content-tab-wrapper">
        <div className="explore-content-tab">
          <div className="content-tab-item selected1">Image</div>
          <div className="content-tab-item">Audio</div>
          <div className="content-tab-item">Text</div>
        </div>
      </div>
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
          </div>
        </div>
      </div>
    </div>
  );
};
