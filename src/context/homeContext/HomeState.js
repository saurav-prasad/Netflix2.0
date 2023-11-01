import { createContext, useContext, useReducer } from "react";

const HomeContext = createContext()

export const HomeState = ({ reducer, initialstate, children }) => {
    return <HomeContext.Provider value={useReducer(reducer, initialstate)}>
        {children}
    </HomeContext.Provider>
}

export const useHomeState = () => useContext(HomeContext)