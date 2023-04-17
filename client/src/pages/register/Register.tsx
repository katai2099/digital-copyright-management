import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userActions } from "../../contexts/state";
import { UseDcm } from "../../contexts/UseDcm";
import { register } from "../../controllers/auth";
import { IUser, User } from "../../model/User";

export const Register = () => {
  const { state, dispatch } = UseDcm();
  const [user, setUser] = useState<IUser>(new User());
  const navigate = useNavigate();

  const submitButtonClickHandler = () => {
    //TODO: validation logic
    user.walletAddress = state.web3State.account;
    register(user)
      .then((res) => {
        // console.log(res);
        dispatch({ type: userActions.create, data: user });
        navigate("/", {
          replace: true,
        });
      })
      .catch((err) => {
        //TODO: handle error response
        console.log(err);
      });
  };

  return (
    <div className="register-area">
      <div className="col-sm-8">
        <div className="profile-box">
          <div className="setting-header">Profile</div>
          <div className="personal-info">Public info</div>
          <div className="wallet-info-wrapper">
            <label className="setting-input-label">Wallet Address</label>
            <div className="input-wrapper">
              <input type="text" value={state.web3State.account} disabled />
            </div>
          </div>
          <div className="username-wrapper">
            <label className="setting-input-label">Username</label>
            <div className="input-wrapper">
              <input
                type="text"
                onBlur={(event) => {
                  setUser({ ...user, username: event?.currentTarget.value });
                }}
              />
            </div>
          </div>
          <div className="username-note">
            *Note that your username will be publicly available on the website.
            Also your profile can be easily accessed from <br />
            &nbsp;&nbsp;<strong>.../profile/username</strong>
          </div>
          <div className="personal-info">Personal Info</div>
          <div className="firstname-wrapper">
            <label className="setting-input-label">Firstname</label>
            <div className="input-wrapper">
              <input
                type="text"
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
                onBlur={(event) => {
                  setUser({ ...user, lastname: event?.currentTarget.value });
                }}
              />
            </div>
          </div>
          <div className="lastname-wrapper">
            <label className="setting-input-label">Email</label>
            <div className="input-wrapper">
              <input
                type="text"
                onBlur={(event) => {
                  setUser({ ...user, email: event?.currentTarget.value });
                }}
              />
            </div>
          </div>
          <button
            className="btn-save-changes"
            onClick={submitButtonClickHandler}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};
