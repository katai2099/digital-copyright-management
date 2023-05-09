import { AxiosError } from "axios";
import React, { useEffect, useReducer } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { APP_STATE_KEY, WEB3_CONNECT_CACHED } from "../constant";
import { connectMetamask, initMetamask, startLogin } from "../controllers/web3";
import { DcmContext } from "./DcmContext";
import { initialState, reducer, userActions, web3Actions } from "./state";

interface IDcmProviderProps {
  children: React.ReactNode;
}

export const DcmProvider = ({ children }: IDcmProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const app_state_cache = localStorage.getItem(APP_STATE_KEY);
  const navigate = useNavigate();

  useEffect(() => {
    const web3_cache = localStorage.getItem(WEB3_CONNECT_CACHED);
    if (!web3_cache && !state.web3State.web3) {
      initMetamask(dispatch);
    }
  }, [state.web3State.web3]);

  useEffect(() => {
    const web3_cache = localStorage.getItem(WEB3_CONNECT_CACHED);
    if (web3_cache === "injected") {
      //TODO: fix does not have to check for ethereum provider if already login
      console.log("metamask use effect");
      startLogin(dispatch);
    }
  }, []);

  // useEffect(() => {
  //   if (app_state_cache && app_state_cache !== "") {
  //     console.log("set app state cache called");
  //     dispatch({
  //       type: userActions.create,
  //       data: JSON.parse(app_state_cache),
  //     });
  //   }
  // }, [app_state_cache]);

  useEffect(() => {
    (window as any).ethereum.on("accountsChanged", function (account: any) {
      const web3_cache = localStorage.getItem(WEB3_CONNECT_CACHED);
      if (web3_cache === "injected") {
        console.log(account);
        startLogin(dispatch)
          .then((user) => {
            console.log(user);
            dispatch({ type: userActions.create, data: user });
          })
          .catch((error) => {
            if (error instanceof AxiosError) {
              if (error.response?.status === 404) {
                // navigate("/register");
                localStorage.removeItem(WEB3_CONNECT_CACHED);
                localStorage.removeItem(APP_STATE_KEY);
                dispatch({
                  type: web3Actions.disconnect,
                  data: { ...state.web3State, account: "" },
                });
                dispatch({
                  type: userActions.reset,
                });
              }
            }
          });
      }
    });
  }, []);

  return (
    <DcmContext.Provider value={{ state, dispatch }}>
      {children}
    </DcmContext.Provider>
  );
};
