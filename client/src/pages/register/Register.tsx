import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userActions, web3Actions } from "../../contexts/state";
import { UseDcm } from "../../contexts/UseDcm";
import { register } from "../../controllers/auth";
import { IUser, User } from "../../model/User";
import {
  registerErrorHandler,
  userRegisterValidation,
} from "../../controllers/user";
import { isObjectEmpty, keyValuePair } from "../../utils";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { disconnectMetamask } from "../../controllers/web3";
export const Register = () => {
  const { state, dispatch } = UseDcm();
  const [user, setUser] = useState<IUser>(new User());
  const [errors, setErrors] = useState<keyValuePair>({});
  const [registering, setRegistering] = useState<boolean>(false);

  const navigate = useNavigate();

  // useEffect(() => {
  //   const cleanupFunction = () => {
  //     if (state.user.walletAddress === "") {
  //       disconnectMetamask(dispatch, state);
  //     }
  //   };
  //   window.addEventListener("beforeunload", cleanupFunction);
  //   return () => {
  //     cleanupFunction();
  //     window.removeEventListener("beforeunload", cleanupFunction);
  //   };
  // }, []);

  // useBeforeUnload(
  //   React.useCallback(() => {
  //     localStorage.stuff = state;
  //   }, [state])
  // );

  const submitButtonClickHandler = () => {
    //TODO: validation logic
    user.walletAddress = state.web3State.account;
    const errors = userRegisterValidation(user);
    if (!isObjectEmpty(errors)) {
      console.log(errors);
      setErrors(errors);
      return;
    }
    dispatch({ type: userActions.create, data: user });
    setRegistering(true);
    register(user, state, dispatch)
      .then(() => {
        setRegistering(false);
        toast.success("Registration Complete. redirect to homepage", {
          onClose: () => {
            console.log(state.user);
            navigate("/", {
              replace: true,
            });
          },
          onClick: () => {
            navigate("/", {
              replace: true,
            });
          },
        });
      })
      .catch((err: any) => {
        console.log(err);
        const error = registerErrorHandler(err);
        if (!isObjectEmpty(error)) {
          setErrors(error);
        } else {
          toast.error("Something went wrong");
        }
        setRegistering(false);
        console.log(err);
      });
  };

  return (
    <div className="register-area">
      <div className="col-sm-5">
        <div className="profile-box">
          <div className="setting-header">Register Here</div>
          <div className="personal-info">Public info</div>
          <div className="wallet-info-wrapper">
            <label className="setting-input-label">Wallet Address</label>
            <div className="input-wrapper">
              <input type="text" value={state.web3State.account} disabled />
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
          {errors.firstname && (
            <div className="error-text">{errors.firstname}</div>
          )}

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
          {errors.lastname && (
            <div className="error-text">{errors.lastname}</div>
          )}

          <div className="lastname-wrapper">
            <label className="setting-input-label">Email</label>
            <div
              className={`input-wrapper ${
                errors.email ? "input-wrapper-error" : ""
              }`}
            >
              <input
                type="text"
                // placeholder="abc@email.com"
                value={user.email}
                onChange={(event) => {
                  if (errors.email && event.currentTarget.value !== "") {
                    const { email, ...newErrors } = errors;
                    setErrors(newErrors);
                  }
                  setUser({ ...user, email: event?.currentTarget.value });
                }}
              />
            </div>
          </div>
          {errors.email && <div className="error-text">{errors.email}</div>}

          <button
            className="btn-save-changes"
            onClick={submitButtonClickHandler}
          >
            {!registering ? (
              "Register"
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
      </div>
    </div>
  );
};
