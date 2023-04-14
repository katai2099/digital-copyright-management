import { useEffect, useState } from "react";
import { UseDcm } from "../../contexts/UseDcm";
import { IUser, User } from "../../model/User";
import { updateUser } from "../../controllers/user";
import { userActions } from "../../contexts/state";
import { shallowCompare } from "../../utils";

export const ProfileUpdate = () => {
  const { state, dispatch } = UseDcm();
  const [user, setUser] = useState<IUser>(new User());
  useEffect(() => {
    console.log(state.user);
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
    <div className="">
      <div className="setting-header">Profile</div>
      <div className="personal-info">Public info</div>
      <div className="wallet-info-wrapper">
        <label className="setting-input-label">Wallet Address</label>
        <div className="input-wrapper">
          <input type="text" defaultValue={state.user.walletAddress} disabled />
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
            value={user.username}
            onChange={(event) => {
              setUser({ ...user, username: event?.currentTarget.value });
            }}
          />
        </div>
      </div>
      <div className="username-note">
        *Note that your username will be publicly available on the website. Also
        your profile can be easily accessed from <br />
        &nbsp;&nbsp;<strong>blabla.com/profile/username</strong>
      </div>
      <div className="personal-info">Personal Info</div>
      <div className="firstname-wrapper">
        <label className="setting-input-label">Firstname</label>
        <div className="input-wrapper">
          <input
            type="text"
            value={user.firstname}
            defaultValue={state.user.firstname}
            onChange={(event) => {
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
            value={user.lastname}
            onChange={(event) => {
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
  );
};
