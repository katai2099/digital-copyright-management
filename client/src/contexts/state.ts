import { AnyAction } from "redux";
import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import { IUser, User } from "../model/User";

export interface DcmState {
  web3State: Web3State;
  user: IUser;
}

export interface Web3State {
  artifact: any;
  web3: Web3 | null;
  accounts: string[];
  networkID: number;
  contract: Contract | null;
}

const initialWeb3State: Web3State = {
  artifact: null,
  web3: null,
  accounts: [],
  networkID: 0,
  contract: null,
};

export const initialState: DcmState = {
  web3State: initialWeb3State,
  user: new User(),
};

const actions = {
  init: "INIT",
  reset: "RESET",
};

const userActions = {
  create: "CREATE",
  reset: "RESET",
};

const web3Reducer = (state: Web3State, action: AnyAction) => {
  const { type, data } = action;
  switch (type) {
    case actions.init: {
      const tmpState: Web3State = data;
      console.log(tmpState);
      return { ...state, ...data };
    }
    case actions.reset:
      return { ...state, initialWeb3State };
    default:
      return state;
  }
};

const userReducer = (state: IUser, action: AnyAction) => {
  const { type, data } = action;
  switch (type) {
    case userActions.create: {
      const tmpUser: IUser = data;
      console.log(tmpUser);
      return { ...state, ...data };
    }
    case actions.reset:
      return { ...state, initialWeb3State };
    default:
      return state;
  }
};

const reducer = (state: DcmState, action: AnyAction) => ({
  web3State: web3Reducer(state.web3State, action),
  user: userReducer(state.user, action),
});

export { actions, reducer };
