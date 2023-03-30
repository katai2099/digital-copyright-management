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
  const [endOfPage, setEndOfPage] = useState<boolean>(false);
  const [noContent, setNoContent] = useState<boolean>(false);

  const sortSelected = (sort: SortType) => {
    console.log(sort);
    setEndOfPage(false);
    setPage(0);
    setNoContent(false);
    setSort(sort);
  };

  const contentTypeSelected = (contentType: string) => {
    console.log(contentType);
    setEndOfPage(false);
    setPage(0);
    setNoContent(false);
    setContentType(contentType as ContentType);
  };

  const pageChangeHandler = () => {
    setPage((oldValue) => oldValue + 1);
    console.log(contents);
  };

  useEffect(() => {
    getContents(contentType, sort, page)
      .then((newContents) => {
        // newContents = [];
        if (page === 0 && newContents.length === 0) {
          setNoContent(true);
        }
        if (page !== 0) {
          setContents((prevContents) => [...prevContents, ...newContents]);
        } else {
          setContents(newContents);
        }
        if (page !== 0 && newContents.length === 0) {
          setEndOfPage(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [contentType, page, sort]);

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
            <input className="explore-input" disabled={noContent} />
          </div>
          <div className="contents-grid">
            {contents.map((content) => (
              <ContentSummary key={content.id} content={content} />
            ))}
          </div>
          {noContent ? (
            <div className="no-contents">No contents</div>
          ) : (
            <div>
              <div className="btn-load-more-wrapper">
                {!endOfPage && (
                  <button
                    className="btn-explore btn-load-more"
                    onClick={pageChangeHandler}
                  >
                    Load more contents
                  </button>
                )}
              </div>
              {endOfPage && (
                <div className="end-of-contents-text">
                  Looks like you reach the end of contents
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
