import { AxiosError } from "axios";
import React, { useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { APP_STATE_KEY, WEB3_CONNECT_CACHED } from "../constant";
import { connectMetamask, initMetamask, startLogin } from "../controllers/web3";
import { DcmContext } from "./DcmContext";
import { initialState, reducer, userActions } from "./state";

interface IDcmProviderProps {
  children: React.ReactNode;
}

export const DcmProvider = ({ children }: IDcmProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const web3_cache = localStorage.getItem(WEB3_CONNECT_CACHED);
  const app_state_cache = localStorage.getItem(APP_STATE_KEY);
  const navigate = useNavigate();
  if (!web3_cache && !state.web3State.web3) {
    initMetamask(dispatch);
  }
  useEffect(() => {
    if (web3_cache === "injected") {
      //TODO: fix does not have to check for ethereum provider if already login
      console.log("metamask use effect");
      connectMetamask(dispatch);
    }
  }, [web3_cache]);
  useEffect(() => {
    if (app_state_cache && app_state_cache !== "") {
      console.log("set app state cache called");
      dispatch({
        type: userActions.create,
        data: JSON.parse(app_state_cache),
      });
    }
  }, [app_state_cache]);

  useEffect(() => {
    (window as any).ethereum.on("accountsChanged", function (account: any) {
      if (account !== state.web3State.account) {
        console.log(account);
        startLogin(dispatch)
          .then((user) => {
            console.log(user);
            dispatch({ type: userActions.create, data: user });
          })
          .catch((error) => {
            if (error instanceof AxiosError) {
              if (error.response?.status === 410) {
                navigate("/register");
              }
            }
          });
      }
    });
  }, [navigate, state.web3State.account]);

  return (
    <DcmContext.Provider value={{ state, dispatch }}>
      {children}
    </DcmContext.Provider>
  );
};
