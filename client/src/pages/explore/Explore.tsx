import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import {
  ContentSummary,
  ContentSummarySkeletonLoading,
} from "../../components/contentSummary/ContentSummary";
import { FilterArea } from "../../components/filterArea/filterArea";
import { FilterBar } from "../../components/filterBar/FilterBar";
import { contentFiltersWithIcon } from "../../constant";
import { getContents } from "../../controllers/content";
import { SortType } from "../../model/Common";
import { Content, ContentType } from "../../model/Content";
import "./explore.css";
import { debounce } from "../../utils";
import { ClipLoader } from "react-spinners";
import React from "react";
import { getCoinRate } from "../../controllers/web3";
import { UseDcm } from "../../contexts/UseDcm";
import { coinRateActions } from "../../contexts/state";

export const Explore = () => {
  const { dispatch } = UseDcm();
  const [contents, setContents] = useState<Content[]>([]);
  const [sort, setSort] = useState<SortType>(SortType.LATEST);
  const [contentType, setContentType] = useState<ContentType>(
    ContentType.IMAGE
  );
  const [page, setPage] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [endOfPage, setEndOfPage] = useState<boolean>(false);
  const [noContent, setNoContent] = useState<boolean>(false);
  const [firstFetching, setFirstFetching] = useState<boolean>(false);
  const [fetchMoreContent, setFetchMoreContent] = useState<boolean>(false);

  const inputRef = React.useRef<HTMLInputElement>(null);

  //TODO: fetch ether price every page

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  useEffect(() => {
    getCoinRate().then((rate) => {
      dispatch({ type: coinRateActions.set, data: rate });
    });
  }, [dispatch]);

  useEffect(() => {
    if (page === 0) setFirstFetching(true);
    getContents(contentType, sort, page, searchQuery)
      .then((newContents) => {
        setFirstFetching(false);
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
        setFetchMoreContent(false);
      })
      .catch((error) => {
        setFirstFetching(false);
        console.log(error);
      });
  }, [contentType, page, searchQuery, sort]);

  const sortSelected = (sort: SortType) => {
    console.log(sort);
    setEndOfPage(false);
    setPage(0);
    setNoContent(false);
    setSort(sort);
  };

  const onSeachChangeHandler = debounce((event: string) => {
    setContents([]);
    setPage(0);
    setNoContent(false);
    setEndOfPage(false);
    setFetchMoreContent(false);
    setSearchQuery(event);
  }, 200);

  const contentTypeSelected = (contentType: string) => {
    inputRef.current!.value = "";
    console.log(contentType);
    setSearchQuery("");
    setContents([]);
    setEndOfPage(false);
    setPage(0);
    setNoContent(false);
    // setSearchQuery("");
    setContentType(contentType as ContentType);
  };

  const pageChangeHandler = () => {
    setFetchMoreContent(true);
    setPage((oldValue) => oldValue + 1);
    console.log(contents);
  };

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
            <input
              ref={inputRef}
              className="explore-input"
              onChange={(event) =>
                onSeachChangeHandler(event.currentTarget.value)
              }
            />
          </div>
          <div className="contents-grid">
            {firstFetching && <ContentSummarySkeletonLoading />}
            {contents.map((content) => (
              <ContentSummary key={content.id} content={content} />
            ))}
          </div>
          {!firstFetching && noContent ? (
            <div className="no-contents">No contents</div>
          ) : (
            <div>
              <div className="btn-load-more-wrapper">
                {!noContent &&
                  !endOfPage &&
                  !firstFetching &&
                  !fetchMoreContent && (
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
          {fetchMoreContent && (
            <div style={{ margin: "10px 0", textAlign: "center" }}>
              <ClipLoader
                color="#88a9ea"
                size={50}
                loading={true}
                speedMultiplier={0.9}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
