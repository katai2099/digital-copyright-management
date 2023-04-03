import { useEffect, useState } from "react";
import { userActions } from "../../contexts/state";
import { UseDcm } from "../../contexts/UseDcm";
import { updateUser } from "../../controllers/user";
import { IUser } from "../../model/User";
import { shallowCompare } from "../../utils";
import "./setting.css";
import { AgreementComponent } from "../../components/agreements/Agreement";
import { Withdraw } from "../../components/withdraw/Withdraw";

export const Setting = () => {
  const { state } = UseDcm();

  return (
    <div className="home-wrapper">
      <div className="setting-wrapper row">
        <div className="options-area col-sm-3">
          <div className="setting-header left">Settings</div>
          <div className="setting-options">
            <div className="setting-option">
              <i className="las la-user"></i>
              <div className="setting-option-title">Profile</div>
            </div>
            <div className="setting-option">
              <i className="las la-file-contract"></i>
              <div className="setting-option-title">Agreements</div>
            </div>
            <div className="setting-option">
              <i className="las la-wallet"></i>
              <div className="setting-option-title">Withdraw</div>
            </div>
            <div className="setting-option">
              <i className="lar la-eye"></i>
              <div className="setting-option-title">View Profile</div>
            </div>
          </div>
        </div>
        <div className="profile-update-area col-sm-8">
          {/* <AgreementComponent walletAddress={state.web3State.account} /> */}
          <Withdraw />
        </div>
      </div>
    </div>
  );
};
