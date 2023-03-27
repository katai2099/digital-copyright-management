import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ContentItems } from "../../components/latest-content/ContentItems";
import { RadioOption } from "../../components/option/RadioOption";
import { ContentFilter, contentFilters } from "../../constant";
import { getLatestContents } from "../../controllers/content";
import { ILatestContents } from "../../model/Common";
import { Content } from "../../model/Content";
import "./home.css";

export const Home = () => {
  const [latestContents, setLatestContents] = useState<ILatestContents>({
    all: [],
    images: [],
    audio: [],
    texts: [],
  });
  const [filter, setFilter] = useState<ContentFilter>(ContentFilter.ALL);
  useEffect(() => {
    getLatestContents()
      .then((latestContents) => {
        setLatestContents(latestContents);
        console.log(latestContents);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const setSelectFilter = (filter: string) => {
    setFilter(filter as ContentFilter);
  };

  const contents = getFilteredContents(filter, latestContents);

  return (
    <div className="home-wrapper">
      <div className="hero-box">
        <div className="slogan-area">
          <h3 className="slogan-title">
            Decentralized Copyright Management Platfrom
          </h3>
          <p className="slogan-detail">
            A platform for register digital content and manage subscription with
            no intermediary
          </p>
          <Link to="/explore">
            <div className="btn-explore">Explore Contents</div>
          </Link>
        </div>
      </div>
      <div className="section-header">
        <h3>Latest Contents</h3>
        <RadioOption
          options={contentFilters}
          optionName="content-filter"
          onSelected={setSelectFilter}
        />
      </div>
      <div className="latest-contents">
        <ContentItems
          title={filter === ContentFilter.ALL ? ContentFilter.IMG : filter}
          contents={contents.slice(0, 5)}
          columnNumber={0}
        />
        <ContentItems
          title={filter === ContentFilter.ALL ? ContentFilter.AUDIO : filter}
          contents={contents.slice(5, 10)}
          columnNumber={1}
        />
        <ContentItems
          title={filter === ContentFilter.ALL ? ContentFilter.TEXT : filter}
          contents={contents.slice(10, 15)}
          columnNumber={2}
        />
      </div>
    </div>
  );

  function getFilteredContents(
    filter: ContentFilter,
    contents: ILatestContents
  ): Content[] {
    if (filter === ContentFilter.ALL) {
      return contents.all;
    } else if (filter === ContentFilter.IMG) {
      return contents.images;
    } else if (filter === ContentFilter.AUDIO) {
      return contents.audio;
    }
    return contents.texts;
  }
};
