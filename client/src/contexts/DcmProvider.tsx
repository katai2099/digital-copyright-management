import React, { useEffect, useReducer } from "react";
import { APP_STATE_KEY, WEB3_CONNECT_CACHED } from "../constant";
import { connectMetamask } from "../controllers/web3";
import { DcmContext } from "./DcmContext";
import { initialState, reducer, userActions } from "./state";

interface IDcmProviderProps {
  children: React.ReactNode;
}

export const DcmProvider = ({ children }: IDcmProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const web3_cache = localStorage.getItem(WEB3_CONNECT_CACHED);
  const app_state_cache = localStorage.getItem(APP_STATE_KEY);
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

  return (
    <DcmContext.Provider value={{ state, dispatch }}>
      {children}
    </DcmContext.Provider>
  );
};
