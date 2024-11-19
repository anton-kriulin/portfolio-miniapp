import { createContext } from "react"
import { ISession } from "./Types";

export const GlobalContext = createContext<ISession | undefined>(undefined);