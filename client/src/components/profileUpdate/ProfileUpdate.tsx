import { useEffect, useState } from "react";
import { UseDcm } from "../../contexts/UseDcm";
import { IUser, User } from "../../model/User";
import {
  registerErrorHandler,
  updateUser,
  userUpdateValidation,
} from "../../controllers/user";
import { userActions } from "../../contexts/state";
import { isObjectEmpty, keyValuePair, shallowCompare } from "../../utils";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";

export const ProfileUpdate = () => {
  const { state, dispatch } = UseDcm();
  const [user, setUser] = useState<IUser>(new User());
  const [errors, setErrors] = useState<keyValuePair>({});
  const [updating, setUpdating] = useState<boolean>(false);

  useEffect(() => {
    console.log(state.user);
    setUser(state.user);
    setErrors({});
  }, [state.user]);
  const saveChangeButtonHandler = () => {
    //TODO: enable button only if there is change in data
    const errors = userUpdateValidation(user);
    if (!isObjectEmpty(errors)) {
      console.log(errors);
      setErrors(errors);
      return;
    }
    setUpdating(true);
    updateUser(user, state, dispatch)
      .then(() => {
        toast.success("update success");
        setUpdating(false);
        dispatch({ type: userActions.update, data: user });
      })
      .catch((err) => {
        const error = registerErrorHandler(err);
        if (!isObjectEmpty(error)) {
          setErrors(error);
        } else {
          toast.error("Something went wrong");
        }
        setUpdating(false);
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
      <div className="personal-info">Personal Info</div>
      <div className="firstname-wrapper">
        <label className="setting-input-label">Firstname</label>
        <div
          className={`input-wrapper ${
            errors.firstname ? "input-wrapper-error" : ""
          }`}
        >
          <input
            type="text"
            value={user.firstname}
            defaultValue={state.user.firstname}
            onChange={(event) => {
              if (errors.firstname && event.currentTarget.value !== "") {
                const { firstname, ...newErrors } = errors;
                setErrors(newErrors);
              }
              setUser({ ...user, firstname: event?.currentTarget.value });
            }}
          />
        </div>
      </div>
      {errors.firstname && <div className="error-text">{errors.firstname}</div>}

      <div className="lastname-wrapper">
        <label className="setting-input-label">Lastname</label>
        <div
          className={`input-wrapper ${
            errors.lastname ? "input-wrapper-error" : ""
          }`}
        >
          <input
            type="text"
            value={user.lastname}
            onChange={(event) => {
              if (errors.lastname && event.currentTarget.value !== "") {
                const { lastname, ...newErrors } = errors;
                setErrors(newErrors);
              }
              setUser({ ...user, lastname: event?.currentTarget.value });
            }}
          />
        </div>
      </div>
      {errors.lastname && <div className="error-text">{errors.lastname}</div>}

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
        {!updating ? (
          "Save Changes"
        ) : (
          <div
            style={{
              textAlign: "center",
              marginTop: "5px",
            }}
          >
            <ClipLoader
              color="#88a9ea"
              size={20}
              loading={true}
              speedMultiplier={0.9}
            />
          </div>
        )}
      </button>
    </div>
  );
};
