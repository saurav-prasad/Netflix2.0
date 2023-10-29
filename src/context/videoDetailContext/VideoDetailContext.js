import { createContext, useContext, useState } from "react";

export const VideoDetailContext = createContext()

export const VideoDetailState = (props) => {
    const [VideoDetailInfo, setVideoDetailInfo] = useState()
    const setVideo = (data) => {
        // console.log(data);
        setVideoDetailInfo(data)
    }
    return <VideoDetailContext.Provider value={{ setVideo, VideoDetailInfo }}>
        {props.children}
    </VideoDetailContext.Provider>
}

export const useVideoDetailState = () => useContext(VideoDetailContext)