import {  AnyAction } from "redux";
import Web3 from "web3";
import {Contract} from "web3-eth-contract"

export interface Web3State {
    artifact : any, 
    web3 : Web3 | null;
    accounts : string[];
    networkID: number;
    contract : Contract | null ;
}

const actions =  {
    init : "INIT",
};

const initialState : Web3State= {
    artifact : null,
    web3 : null,
    accounts: [],
    networkID: 0,
    contract: null,
}

const reducer = (state : Web3State, action : AnyAction) => {
    const { type, data } = action;
    switch (type) {
      case actions.init:
        return { ...state, ...data };
      default:
        throw new Error("Undefined reducer action type");
    }
  };

export {
    actions,
    initialState,
    reducer,
}