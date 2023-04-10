import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SortType } from "../../model/Common";
import { Content, ContentType } from "../../model/Content";
import {
  ContentSummary,
  ContentSummarySkeletonLoading,
} from "../contentSummary/ContentSummary";
import { FilterArea } from "../filterArea/filterArea";
import { useEffect, useRef, useState } from "react";
import { IEventProps } from "../events/Events";
import { getUserContents } from "../../controllers/content";
import { debounce } from "../../utils";
import { usePrevious } from "../../hooks/usePrevious";
import { ClipLoader } from "react-spinners";

export const Contents = ({ contentType, walletAddress }: IEventProps) => {
  const [contents, setContents] = useState<Content[]>([]);
  const [sort, setSort] = useState<SortType>(SortType.LATEST);
  const [page, setPage] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [endOfPage, setEndOfPage] = useState<boolean>(false);
  const [noContent, setNoContent] = useState<boolean>(false);
  const [firstFetching, setFirstFetching] = useState<boolean>(false);
  const [fetchMoreContent, setFetchMoreContent] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const prevContentType = usePrevious(contentType);

  useEffect(() => {
    contentTypeReset();
    if (page === 0) setFirstFetching(true);
    getUserContents(walletAddress, contentType, sort, page, searchQuery)
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
  }, [contentType, page, sort, walletAddress, searchQuery]);

  const contentTypeReset = () => {
    if ((prevContentType as ContentType) !== contentType) {
      inputRef.current!.value = "";
      setSearchQuery("");
      setContents([]);
      setEndOfPage(false);
      setPage(0);
      setNoContent(false);
      // setSearchQuery("");
    }
  };

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

  const pageChangeHandler = () => {
    setFetchMoreContent(true);
    setPage((oldValue) => oldValue + 1);
    console.log(contents);
  };

  return (
    <div className="row">
      <div className="col-sm-3">
        <FilterArea onSelected={sortSelected} />
        <div className="filter-separator" />
      </div>
      <div className="col-sm-9">
        <div className="explore-input-wrapper">
          <div className="input-icon">
            <i>
              <FontAwesomeIcon icon={faSearch} />
            </i>
          </div>
          <input
            ref={inputRef}
            onChange={(event) =>
              onSeachChangeHandler(event.currentTarget.value)
            }
            className="explore-input"
          />
        </div>
        <div className="contents-grid">
          {firstFetching && <ContentSummarySkeletonLoading />}
          {contents.map((content) => (
            <ContentSummary content={content} />
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
  );
};
