import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./dcmSearch.css";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import { User } from "../../model/User";
import { Content } from "../../model/Content";
import { search } from "../../controllers/user";
import { ISearchResult } from "../../model/Common";
import {
  debounce,
  fromWei,
  generateRandomLinearGradient,
  getImageSrc,
} from "../../utils";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { UseDcm } from "../../contexts/UseDcm";
import { EtherIcon } from "../common/Icon";

interface IDcmSearchProps {
  backdropActive: boolean;
  onSearch: (searching: boolean) => void;
}

export const DcmSearch = (props: IDcmSearchProps) => {
  const { state } = UseDcm();
  const [searchValue, setSearch] = useState<string>("");
  const [searchResult, setSearchResult] = useState<ISearchResult>({
    contents: [],
    users: [],
  });
  const [showResultBox, setShowResultBox] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [doneFetching, setDoneFetching] = useState<boolean>(false);
  const navigate = useNavigate();
  const inputElement = useRef<HTMLInputElement>(null);

  const onSearchHandler = debounce((value: string) => {
    setSearch(value);
  }, 300);

  useEffect(() => {
    if (searchValue !== "") {
      setDoneFetching(false);
      setShowResultBox(true);
      setLoading(true);
      search(searchValue)
        .then((res) => {
          setLoading(false);
          if (doneFetching) setSearchResult(res);
          setDoneFetching(true);
        })
        .catch((error) => {
          setLoading(false);
          setDoneFetching(true);
          console.log(error);
        });
    } else {
      console.log("this is called");
      setSearchResult({
        contents: [],
        users: [],
      });
      setShowResultBox(false);
      props.onSearch(false);
    }
  }, [searchValue]);

  useEffect(() => {
    if (props.backdropActive === false) {
      inputElement.current!.value = "";
    }
  }, [props.backdropActive]);

  const onContentClickHandler = (content: Content) => {
    setShowResultBox(false);
    props.onSearch(false);
    navigate(`/content/${content.id}`);
  };

  const onUserClickHandler = (user: User) => {
    setShowResultBox(false);
    props.onSearch(false);
    navigate(`/profile/${user.walletAddress}`);
  };

  return (
    <div>
      <div className="search-bar">
        <div className="search-icon">
          <i>
            <FontAwesomeIcon icon={faSearch} />
          </i>
        </div>
        <input
          ref={inputElement}
          className="search-input"
          type="search"
          placeholder="Search for titles or usernames"
          aria-label="Search"
          onChange={(event) => {
            props.onSearch(true);

            onSearchHandler(event.currentTarget.value);
          }}
        />
      </div>
      {props.backdropActive && showResultBox && (
        <div className="search-results">
          <div>
            <div className="section-title">Contents</div>
            <div>
              {loading && (
                <div style={{ margin: "10px 0", textAlign: "center" }}>
                  <ClipLoader
                    color="#88a9ea"
                    size={50}
                    loading={loading}
                    speedMultiplier={0.9}
                  />
                </div>
              )}
              {!loading &&
                searchResult.contents.map((content) => (
                  <div
                    className="item-result-wrapper"
                    onClick={() => {
                      onContentClickHandler(content);
                    }}
                  >
                    <div className="item-result">
                      <div>
                        <img
                          className="item-result-img"
                          src={getImageSrc(content)}
                          alt=""
                        />
                        <div className="item-result-title">
                          {" "}
                          {content.title}
                        </div>
                      </div>
                      <div className="item-result-price">
                        {" "}
                        <div className="ether-price-wrapper">
                          <EtherIcon />{" "}
                          <div className="ether-price">
                            {fromWei(content.price.toString(), state)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              {doneFetching && searchResult.contents.length === 0 && (
                <div
                  className="no-contents"
                  style={{ margin: "10px 0", textAlign: "center" }}
                >
                  No contents found
                </div>
              )}
            </div>
          </div>
          <div>
            <div className="section-title">Users</div>
            <div>
              {loading && (
                <div style={{ margin: "10px 0", textAlign: "center" }}>
                  <ClipLoader
                    color="#88a9ea"
                    size={50}
                    loading={loading}
                    speedMultiplier={0.9}
                  />
                </div>
              )}
              {!loading &&
                searchResult.users.map((user) => (
                  <div
                    className="item-result-wrapper"
                    onClick={() => {
                      onUserClickHandler(user);
                    }}
                  >
                    <div className="item-result">
                      <div className="item-result-info">
                        <div
                          className="item-result-img user"
                          style={{ background: generateRandomLinearGradient() }}
                        />
                        <div className="item-result-title">
                          {`${user.firstname} ${user.lastname}`}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              {doneFetching && searchResult.users.length === 0 && (
                <div
                  className="no-contents"
                  style={{ margin: "10px 0", textAlign: "center" }}
                >
                  No users found
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
