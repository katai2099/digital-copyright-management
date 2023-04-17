import { useEffect, useState } from "react";
import { coinRateActions } from "../../contexts/state";
import { UseDcm } from "../../contexts/UseDcm";
import "./setting.css";
import { AgreementComponent } from "../../components/agreements/Agreement";
import { RequestComponent } from "../../components/request/Request";
import { SettingTab } from "../../constant";
import { useNavigate, useParams } from "react-router-dom";
import { ProfileUpdate } from "../../components/profileUpdate/ProfileUpdate";
import { TransactionComponent } from "../../components/transaction/Transaction";
import { getCoinRate } from "../../controllers/web3";

export const Setting = () => {
  const { state, dispatch } = UseDcm();
  const navigate = useNavigate();
  const [tab, setTab] = useState<SettingTab>(SettingTab.Profile);
  const tabChangeHandler = (newTab: SettingTab) => {
    setTab(newTab);
    navigate(`/settings/${newTab}`);
  };

  const { option } = useParams();
  useEffect(() => {
    if (Object.values(SettingTab).some((key) => key === option)) {
      setTab(option as SettingTab);
    } else {
      navigate(`/settings`);
    }
  }, [navigate, option]);

  useEffect(() => {
    getCoinRate().then((rate) => {
      dispatch({ type: coinRateActions.set, data: rate });
    });
  }, [dispatch]);

  return (
    <div className="home-wrapper">
      <div className="setting-wrapper row">
        <div className="options-area col-sm-3">
          <div className="setting-header left">Settings</div>
          <div className="setting-options">
            <div
              className="setting-option"
              onClick={() => tabChangeHandler(SettingTab.Profile)}
            >
              <i className="las la-user"></i>
              <div className="setting-option-title">Profile</div>
            </div>
            <div
              className="setting-option"
              onClick={() => tabChangeHandler(SettingTab.Request)}
            >
              <i className="las la-wallet"></i>
              <div className="setting-option-title">Request</div>
            </div>
            <div
              className="setting-option"
              onClick={() => tabChangeHandler(SettingTab.Agreement)}
            >
              <i className="las la-file-contract"></i>
              <div className="setting-option-title">Agreement</div>
            </div>
            <div
              className="setting-option"
              onClick={() => tabChangeHandler(SettingTab.Transaction)}
            >
              <i className="las la-file-contract"></i>
              <div className="setting-option-title">Transaction</div>
            </div>
            <div
              className="setting-option"
              onClick={() => navigate(`/profile/${state.web3State.account}`)}
            >
              <i className="lar la-eye"></i>
              <div className="setting-option-title">View Profile</div>
            </div>
          </div>
        </div>
        <div className="profile-update-area col-sm-9 profile-box">
          {tab === SettingTab.Agreement && (
            <AgreementComponent walletAddress={state.web3State.account} />
          )}
          {tab === SettingTab.Request && <RequestComponent />}
          {tab === SettingTab.Profile && <ProfileUpdate />}
          {tab === SettingTab.Transaction && <TransactionComponent />}
        </div>
      </div>
    </div>
  );
};
