import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { ContentSummary } from "../../components/contentSummary/ContentSummary";
import { FilterArea } from "../../components/filterArea/filterArea";
import { FilterBar } from "../../components/filterBar/FilterBar";
import { contentFiltersWithIcon } from "../../constant";
import { getContents } from "../../controllers/content";
import { SortType } from "../../model/Common";
import { Content, ContentType } from "../../model/Content";
import "./explore.css";

export const Explore = () => {
  const [contents, setContents] = useState<Content[]>([]);
  const [sort, setSort] = useState<SortType>(SortType.LATEST);
  const [contentType, setContentType] = useState<ContentType>(
    ContentType.IMAGE
  );
  const [page, setPage] = useState<number>(0);

  const sortSelected = (sort: SortType) => {
    console.log(sort);
    setSort(sort);
  };

  const contentTypeSelected = (contentType: string) => {
    console.log(contentType);
    setContentType(contentType as ContentType);
  };

  useEffect(() => {
    getContents(contentType, sort, page)
      .then((newContents) => {
        setContents(newContents);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [contentType, page, sort]);

  document.addEventListener("scroll", () => {
    if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight) {
      console.log("end of page");
      setPage((prev) => prev + 1);
    }
  });

  return (
    <div className="home-wrapper">
      <div className="explore-header">
        <h3 style={{ color: "#000" }}>Explore Contents</h3>
      </div>
      <FilterBar
        options={contentFiltersWithIcon}
        inputName="content-filter"
        onClicked={contentTypeSelected}
      />
      <div className="content-area">
        <div className="filter-area">
          <FilterArea onSelected={sortSelected} />
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
            {contents.map((content) => (
              <ContentSummary key={content.Id} content={content} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
