import { createContext } from "react";
import {initialState} from './state';

export const EthContext = createContext({state:initialState,dispatch:{}});

