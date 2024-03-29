import { faCopy } from "@fortawesome/free-solid-svg-icons";
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
import { toast } from "react-toastify";
import { generateRandomLinearGradient } from "../../utils";

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
    window.scroll(0, 0);
  }, []);

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

  const lineargradient = generateRandomLinearGradient();

  return (
    <div className="profile-wrapper">
      <div
        className="profile-cover-image"
        style={
          user.walletAddress !== "0xA90D7fB9CfdF1c33C0bC0bE58605C4f2Bfc40972"
            ? { background: lineargradient }
            : {}
        }
      />
      <div className="home-wrapper">
        <div
          className="profile-image"
          style={
            user.walletAddress !== "0xA90D7fB9CfdF1c33C0bC0bE58605C4f2Bfc40972"
              ? { background: lineargradient }
              : {}
          }
        />
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
                  toast.success("Copied to clipboard");
                }}
              >
                {user.walletAddress.substring(0, 6)}{" "}
                <i>
                  <FontAwesomeIcon icon={faCopy} />
                </i>
              </div>
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
