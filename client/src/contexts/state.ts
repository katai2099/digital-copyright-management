import { AnyAction } from "redux";
import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import { APP_STATE_KEY } from "../constant";
import { IConversionRate } from "../model/Common";
import { IUser, User } from "../model/User";

export interface DcmState {
  web3State: Web3State;
  user: IUser;
  coinRate: IConversionRate;
  loadingState: LoadingState;
}

export interface LoadingState {
  loading: boolean;
  loadingText: string;
}

export interface Web3State {
  artifact: any;
  web3: Web3 | null;
  account: string;
  networkID: number;
  contract: Contract | null;
}

const initialLoadingState: LoadingState = {
  loading: false,
  loadingText: "",
};

const initialWeb3State: Web3State = {
  artifact: null,
  web3: null,
  account: "",
  networkID: 0,
  contract: null,
};

export const initialConversionRate: IConversionRate = {
  ETHToUSD: 0,
  USDToETH: 0,
};

export const initialState: DcmState = {
  web3State: initialWeb3State,
  user: new User(),
  coinRate: initialConversionRate,
  loadingState: initialLoadingState,
};

const web3Actions = {
  init: "INIT_WEB3",
  disconnect: "DISCONNECT_WEB3",
};

const web3Reducer = (state: Web3State, action: AnyAction) => {
  const { type, data } = action;
  switch (type) {
    case web3Actions.init: {
      const tmpState: Web3State = data;
      return tmpState;
    }
    case web3Actions.disconnect: {
      console.log(data);
      return { ...data };
    }
    default:
      return state;
  }
};

const userActions = {
  create: "CREATE_USER",
  update: "UPDATE_USER",
  reset: "RESET_USER",
};

const userReducer = (state: IUser, action: AnyAction) => {
  const { type, data } = action;
  switch (type) {
    case userActions.create: {
      window.localStorage.setItem(APP_STATE_KEY, JSON.stringify(data));
      return data;
    }
    case userActions.update: {
      const newData = { ...state, ...data };
      window.localStorage.setItem(APP_STATE_KEY, JSON.stringify(newData));
      return { ...state, ...data };
    }
    case userActions.reset:
      return new User();

    default:
      return state;
  }
};

export const coinRateActions = {
  set: "SET_COINRATE",
};

const coinConversionReducer = (state: IConversionRate, action: AnyAction) => {
  const { type, data } = action;
  switch (type) {
    case coinRateActions.set: {
      return data;
    }
    default:
      return state;
  }
};

export const loadingActions = {
  setLoading: "LOADING_SET",
  resetLoading: "LOADING_RESET",
};

const loadingReducer = (state: LoadingState, action: AnyAction) => {
  const { type, data } = action;
  switch (type) {
    case loadingActions.setLoading: {
      return data;
    }
    case loadingActions.resetLoading: {
      return initialLoadingState;
    }
    default:
      return state;
  }
};

const reducer = (state: DcmState, action: AnyAction) => ({
  web3State: web3Reducer(state.web3State, action),
  user: userReducer(state.user, action),
  coinRate: coinConversionReducer(state.coinRate, action),
  loadingState: loadingReducer(state.loadingState, action),
});

export { userActions, reducer, web3Actions };
