import React, { useEffect, useReducer } from "react";
import { connectMetamask } from "../controllers/web3";
import { DcmContext } from "./DcmContext";
import { initialState, reducer } from "./state";

interface IDcmProviderProps {
  children: React.ReactNode;
}

export const DcmProvider = ({ children }: IDcmProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const web3_cache = localStorage.getItem("WEB3_CONNECT_CACHED_PROVIDER");
  useEffect(() => {
    if (web3_cache === "injected") {
      connectMetamask(dispatch);
    }
  }, [web3_cache]);

  return (
    <DcmContext.Provider value={{ state, dispatch }}>
      {children}
    </DcmContext.Provider>
  );
};
