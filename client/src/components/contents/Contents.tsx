import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SortType } from "../../model/Common";
import { Content, ContentType } from "../../model/Content";
import { ContentSummary } from "../contentSummary/ContentSummary";
import { FilterArea } from "../filterArea/filterArea";
import { ChangeEvent, useEffect, useState } from "react";
import { IEventProps } from "../events/Events";
import { getUserContents } from "../../controllers/content";
import { debounce } from "../../utils";

// export interface IContentTypeProps {
//   contentType: ContentType;
// }

export const Contents = ({ contentType, walletAddress }: IEventProps) => {
  const type = contentType;
  const [sort, setSort] = useState<SortType>(SortType.LATEST);
  const [page, setPage] = useState<number>(0);
  const [contents, setContents] = useState<Content[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  useEffect(() => {
    getUserContents(walletAddress, contentType, sort, page, searchQuery)
      .then((contents) => {
        setContents(contents);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [contentType, page, sort, walletAddress, searchQuery]);

  const sortSelected = (sort: SortType) => {
    console.log(sort);
    console.log(type);
    // setEndOfPage(false);
    // setPage(0);
    // setNoContent(false);
    setSort(sort);
  };

  const onSeachChangeHandler = debounce((event: string) => {
    console.log(event);
    setSearchQuery(event);
  }, 200);

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
            onChange={(event) =>
              onSeachChangeHandler(event.currentTarget.value)
            }
            className="explore-input"
          />
        </div>
        <div className="contents-grid">
          {contents.map((content) => (
            <ContentSummary content={content} />
          ))}
        </div>
      </div>
    </div>
  );
};
