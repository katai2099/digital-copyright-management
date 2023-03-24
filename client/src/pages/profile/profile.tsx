import { faCopy, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Contents } from "../../components/contents/Contents";
import { Events } from "../../components/events/Events";
import { FilterBar } from "../../components/filterBar/FilterBar";
import { RadioOption } from "../../components/option/RadioOption";
import {
  contentFilter,
  profileFiltersWithIcon,
  ProfileTab,
} from "../../constant";
import { ContentType } from "../../model/Content";
import "./profile.css";

export const Profile = () => {
  const [profileTab, setProfileTab] = useState<ProfileTab>(ProfileTab.CONTENTS);
  const [contentType, setContentType] = useState<ContentType>(
    ContentType.IMAGE
  );

  const profileTabChangedHandler = (selectedTab: string) => {
    const tab = selectedTab as ProfileTab;
    if (tab !== profileTab) {
      setProfileTab(tab);
    }
  };

  const contentTypeChangeHandler = (selectedContentType: string) => {
    const type = selectedContentType as ContentType;
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
        <div className="wallet-name">Cookie</div>
        <div className="wallet-info-bar">
          <div className="wallet-detail-box">
            0xfs{" "}
            <i>
              <FontAwesomeIcon icon={faCopy} />
            </i>
          </div>
          <div className="wallet-detail-box">
            phommach{" "}
            <i>
              <FontAwesomeIcon icon={faCopy} />
            </i>
          </div>
          <a href="#">
            <div className="ether-io-box">
              <img
                height="24px"
                width="24px"
                src="./img/etherscan-logo-circle.svg"
              />
            </div>
          </a>
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
          {/* Content tab */}
          {/* <Contents/> */}
          {/* History tab */}
          {/* <Events /> */}
          {profileTab === ProfileTab.CONTENTS ? (
            <Contents contentType={contentType} />
          ) : (
            <Events contentType={contentType} />
          )}
        </div>
      </div>
    </div>
  );
};
