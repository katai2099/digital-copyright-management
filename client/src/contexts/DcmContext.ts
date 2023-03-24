import { createContext, Dispatch } from "react";
import { DcmState, initialState } from "./state";

export const DcmContext = createContext<{
  state: DcmState;
  dispatch: Dispatch<any>;
}>({ state: initialState, dispatch: () => null });
