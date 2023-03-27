import { useEffect, useState } from "react";
import { userActions } from "../../contexts/state";
import { UseDcm } from "../../contexts/UseDcm";
import { updateUser } from "../../controllers/user";
import { IUser } from "../../model/User";
import { shallowCompare } from "../../utils";
import "./setting.css";

export const Setting = () => {
  const { state, dispatch } = UseDcm();
  const [user, setUser] = useState<IUser>(state.user);
  useEffect(() => {
    setUser(state.user);
  }, [state.user]);
  const saveChangeButtonHandler = () => {
    //TODO: enable button only if there is change in data
    updateUser(user)
      .then(() => {
        dispatch({ type: userActions.update, data: user });
      })
      .catch((error) => {
        console.log("TRY NA CATCH ERROR ");
      });
  };
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
              <i className="lar la-eye"></i>
              <div className="setting-option-title">View Profile</div>
            </div>
          </div>
        </div>
        <div className="profile-update-area col-sm-8">
          <div className="profile-box">
            <div className="setting-header">Profile</div>
            <div className="personal-info">Public info</div>
            <div className="wallet-info-wrapper">
              <label className="setting-input-label">Wallet Address</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  defaultValue={state.user.walletAddress}
                  disabled
                />
              </div>
            </div>
            <div className="username-wrapper">
              <label className="setting-input-label">Username</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  defaultValue={
                    state.user.username === ""
                      ? state.user.walletAddress
                      : state.user.username
                  }
                  onBlur={(event) => {
                    setUser({ ...user, username: event?.currentTarget.value });
                  }}
                />
              </div>
            </div>
            <div className="username-note">
              *Note that your username will be publicly available on the
              website. Also your profile can be easily accessed from <br />
              &nbsp;&nbsp;<strong>blabla.com/profile/username</strong>
            </div>
            <div className="personal-info">Personal Info</div>
            <div className="firstname-wrapper">
              <label className="setting-input-label">Firstname</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  defaultValue={state.user.firstname}
                  onBlur={(event) => {
                    setUser({ ...user, firstname: event?.currentTarget.value });
                  }}
                />
              </div>
            </div>
            <div className="lastname-wrapper">
              <label className="setting-input-label">Lastname</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  defaultValue={state.user.lastname}
                  onBlur={(event) => {
                    setUser({ ...user, lastname: event?.currentTarget.value });
                  }}
                />
              </div>
            </div>
            <div className="lastname-wrapper">
              <label className="setting-input-label">Email</label>
              <div className="input-wrapper">
                <input type="text" defaultValue={state.user.email} disabled />
              </div>
            </div>
            <button
              className="btn-save-changes"
              onClick={saveChangeButtonHandler}
              disabled={shallowCompare(state.user, user)}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
