import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ContentItems } from "../../components/latest-content/ContentItems";
import { RadioOption } from "../../components/option/RadioOption";
import {
  ContentFilter,
  WEB3_CONNECT_CACHED,
  contentFilters,
} from "../../constant";
import { coinRateActions } from "../../contexts/state";
import { UseDcm } from "../../contexts/UseDcm";
import { getLatestContents } from "../../controllers/content";
import { getCoinRate, startLogin } from "../../controllers/web3";
import { ILatestContents } from "../../model/Common";
import { Content, ContentType } from "../../model/Content";
import "./home.css";

export const Home = () => {
  const [latestContents, setLatestContents] = useState<ILatestContents>({
    all: [],
    images: [],
    audio: [],
    texts: [],
  });
  const { state, dispatch } = UseDcm();
  const [filter, setFilter] = useState<ContentFilter>(ContentFilter.ALL);
  const [fetching, setFetching] = useState<boolean>(false);
  const passState = useLocation();
  useEffect(() => {
    const { state } = passState;
    if (state) {
      const { refresh } = state;
      if (refresh) {
        startLogin(dispatch);
      }
    }
  }, []);

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  useEffect(() => {
    getCoinRate().then((rate) => {
      dispatch({ type: coinRateActions.set, data: rate });
    });
  }, [dispatch]);

  useEffect(() => {
    setFetching(true);
    getLatestContents()
      .then((latestContents) => {
        setLatestContents(latestContents);
        setFetching(false);

        console.log(latestContents);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [dispatch]);

  const setSelectFilter = (filter: string) => {
    console.log(state.web3State);

    setFilter(filter as ContentFilter);
  };

  const contents = getFilteredContents(filter, latestContents);
  const images = latestContents.all.filter(
    (entry) => entry.contentType === ContentType.IMAGE
  );
  const audio = latestContents.all.filter(
    (entry) => entry.contentType === ContentType.AUDIO
  );
  const texts = latestContents.all.filter(
    (entry) => entry.contentType === ContentType.TEXT
  );
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
          contents={
            filter === ContentFilter.ALL ? images : contents.slice(0, 5)
          }
          columnNumber={0}
          loading={fetching}
          all={filter === ContentFilter.ALL}
        />
        <ContentItems
          title={filter === ContentFilter.ALL ? ContentFilter.AUDIO : filter}
          contents={
            filter === ContentFilter.ALL ? audio : contents.slice(5, 10)
          }
          columnNumber={1}
          loading={fetching}
          all={filter === ContentFilter.ALL}
        />
        <ContentItems
          title={filter === ContentFilter.ALL ? ContentFilter.TEXT : filter}
          contents={
            filter === ContentFilter.ALL ? texts : contents.slice(10, 15)
          }
          columnNumber={2}
          loading={fetching}
          all={filter === ContentFilter.ALL}
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
