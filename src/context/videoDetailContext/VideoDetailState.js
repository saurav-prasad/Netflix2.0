import { createContext, useContext, useReducer } from "react";

const VideoDetailContext = createContext()

export const VideoDetailState = ({ reducer, initialState, children }) => {
    return <VideoDetailContext.Provider value={useReducer(reducer, initialState)}>
        {children}
    </VideoDetailContext.Provider>
}

export const useVideoDetailState = () => useContext(VideoDetailContext)