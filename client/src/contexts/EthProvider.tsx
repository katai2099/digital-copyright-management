import React, { useCallback, useEffect, useReducer } from "react";
import Web3 from "web3";
import { EthContext } from "./EthContext";
import { reducer, actions, initialState} from "./state";
type Props = {
    children: React.ReactNode
}



export const EthProvider = (props: Props) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const init = useCallback(async (artifact: any) => {
    if (artifact) {
      const web3 = new Web3(Web3.givenProvider || "ws://localhost:9545");
      const accounts = await web3.eth.requestAccounts();
      console.log(accounts);
      const networkID = await web3.eth.net.getId();
      const { abi } = artifact;
      let address, contract;
      try {
        console.log("this is called")
        address = artifact.networks[networkID].address;
        contract = new web3.eth.Contract(abi, address);
      } catch (err) {
        console.error(err);
      }
      dispatch({
        type: actions.init,
        data: { artifact, web3, accounts, networkID, contract },
      });
    }
  }, []);

  useEffect(() => {
    console.log("this is called")
    const tryInit = async () => {
        try{
            const artifact = require("../contracts/CopyrightManagement.json")
            init(artifact);
        }catch(err){
            console.error(err)
        }
    }
    tryInit();
  }, [init]);

  useEffect(() => {
    const events = ["chainChanged", "accountsChanged"];
    const handleChange = () => {
      console.log('this called ',state.artifact)
      const artifact = require("../contracts/CopyrightManagement.json")
      init(artifact);
    };
 //   console.log((window as any).ethereum);
    events.forEach(e => (window as any).ethereum.on(e, handleChange));
    return () => {
      events.forEach(e => (window as any).ethereum.removeListener(e, handleChange));
    };
  }, [init, state.artifact]);

  return (
    <EthContext.Provider value={{ state, dispatch }}>
      {props.children}
    </EthContext.Provider>
  );
};
