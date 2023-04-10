import { faCopy, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Contents } from "../../components/contents/Contents";
import { Events } from "../../components/events/Events";
import { FilterBar } from "../../components/filterBar/FilterBar";
import { RadioOption } from "../../components/option/RadioOption";
import {
  ContentFilter,
  contentFilter,
  GOERLI_TEST_NET_URL,
  profileFiltersWithIcon,
  ProfileTab,
} from "../../constant";
import { getUserByWalletAddress } from "../../controllers/user";
import { ContentType } from "../../model/Content";
import { IUser, User } from "../../model/User";
import "./profile.css";
import Skeleton from "react-loading-skeleton";
import { UseDcm } from "../../contexts/UseDcm";
import { getCoinRate } from "../../controllers/web3";
import { coinRateActions } from "../../contexts/state";

export const Profile = () => {
  const { dispatch } = UseDcm();
  const [user, setUser] = useState<IUser>(new User());
  const [profileTab, setProfileTab] = useState<ProfileTab>(ProfileTab.CONTENTS);
  const [contentType, setContentType] = useState<ContentType>(
    ContentType.IMAGE
  );
  const [fetchingUser, setFetchingUser] = useState<boolean>(false);

  const { walletAddress } = useParams();

  useEffect(() => {
    getCoinRate().then((rate) => {
      dispatch({ type: coinRateActions.set, data: rate });
    });
  }, [dispatch]);

  useEffect(() => {
    setFetchingUser(true);
    getUserByWalletAddress(walletAddress!)
      .then((user) => {
        setUser(user);
        setFetchingUser(false);
      })
      .catch((error) => {
        setFetchingUser(false);
        console.log(error);
      });
  }, [walletAddress]);

  const profileTabChangedHandler = (selectedTab: string) => {
    const tab = selectedTab as ProfileTab;
    if (tab !== profileTab) {
      setProfileTab(tab);
    }
  };

  const contentTypeChangeHandler = (selectedContentType: string) => {
    let type = selectedContentType as ContentType;
    if (selectedContentType === ContentFilter.IMG) {
      type = ContentType.IMAGE;
    }
    if (type !== contentType) {
      setContentType(type);
    }
  };

  return (
    <div className="profile-wrapper">
      <div className="profile-cover-image"></div>
      <div className="home-wrapper">
        <div className="profile-image"></div>
        <br />
        <div className="wallet-name">
          {fetchingUser ? (
            <Skeleton width={"30%"} />
          ) : (
            `${user.firstname} ${user.lastname}`
          )}
        </div>
        <div className="wallet-email">
          {fetchingUser ? <Skeleton width={"20%"} /> : `${user.email}`}
        </div>
        <div className="wallet-info-bar">
          {fetchingUser ? (
            <Skeleton width={"30%"} />
          ) : (
            <>
              <div
                className="wallet-detail-box"
                onClick={() => {
                  navigator.clipboard.writeText(user.walletAddress);
                }}
              >
                {user.walletAddress.substring(0, 6)}{" "}
                <i>
                  <FontAwesomeIcon icon={faCopy} />
                </i>
              </div>
              {user.username !== "" && (
                <div
                  className="wallet-detail-box"
                  onClick={() => {
                    navigator.clipboard.writeText(user.username);
                  }}
                >
                  {user.username}{" "}
                  <i>
                    <FontAwesomeIcon icon={faCopy} />
                  </i>
                </div>
              )}
              <a
                href={`${GOERLI_TEST_NET_URL}${user.walletAddress}`}
                target="_blank"
                rel="noreferrer"
              >
                <div className="ether-io-box">
                  <img
                    height="24px"
                    width="24px"
                    src="../../img/etherscan-logo-circle.svg"
                    alt=""
                  />
                </div>
              </a>
            </>
          )}
        </div>
        <hr />
        <FilterBar
          options={profileFiltersWithIcon}
          inputName="profile-filter"
          onClicked={profileTabChangedHandler}
        />
        <RadioOption
          options={contentFilter}
          optionName="profile-content-filter"
          onSelected={contentTypeChangeHandler}
          style={{ marginBottom: "24px" }}
        />
        <div>
          {profileTab === ProfileTab.CONTENTS ? (
            <Contents
              contentType={contentType}
              walletAddress={walletAddress!}
            />
          ) : (
            <Events contentType={contentType} walletAddress={walletAddress!} />
          )}
        </div>
      </div>
    </div>
  );
};
