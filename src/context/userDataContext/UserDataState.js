import { createContext, useContext, useReducer } from "react";

const UserDataContext = createContext()

export const UserDataState = ({ reducer, initialstate, children }) => {
    return <UserDataContext.Provider value={useReducer(reducer, initialstate)}>
        {children}
    </UserDataContext.Provider>
}

export const useUserDataState = () => useContext(UserDataContext)