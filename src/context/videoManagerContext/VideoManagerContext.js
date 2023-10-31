import { createContext, useContext } from "react";
import { useUserDataState } from "../userDataContext/UserDataState";
import { backend } from "../../axios";

const VideoManagerContext = createContext()

export const VideoManagerState = (props) => {
    const [user, dispatch] = useUserDataState()

    const authToken = localStorage.getItem('auth-token')

    const fetchMoviesData = async (check) => {
        if (check === 'history') {
            const historyData = await backend.get('/history/fetchhistory',
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': authToken,
                    }
                }
            )
            const a = historyData.data.data?.sort((a, b) => a.timeStamp.localeCompare(b.timeStamp));
            a.reverse()
            // console.log(a);
            dispatch({
                ...user,
                type: 'Set_User',
                history: a
            })
        }
        else if (check === 'wishList') {
            const wishlistData = await backend.get('/wishlist/fetchwishlist',
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': authToken,
                    }
                }
            )
            const a = wishlistData.data.data?.sort((a, b) => a.timeStamp.localeCompare(b.timeStamp));
            a.reverse()
            // console.log(a);
            dispatch({
                ...user,
                type: 'Set_User',
                wishList: a
            })
        }
    }

    // History
    const addHistory = async (data) => {
        const newData = {
            trailerId: data.trailerId,
            movieId: data.movieId,
            backdrop_path: data?.backdrop_path,
            name: data?.original_name || data?.name || data?.title,
            release_date: data?.release_date || data?.first_air_date,
            overview: data.overview,
            vote_average: data.vote_average
        }
        const savedHistory = await backend.post('/history/addhistory', newData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': authToken,
                }
            }
        )
        if (savedHistory) {
            fetchMoviesData('history')
        }
    }
    const deleteHistory = async (movieId) => {
        await backend.delete(`/history/deletehistory/${movieId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': authToken,
                }
            }
        )
        const updatedData = user.history.filter((item) => item.movieId !== movieId)
        dispatch({
            ...user,
            type: 'Set_User',
            history: updatedData
        })
    }
    // WishList
    const addWishList = async (data) => {
        const newData = {
            trailerId: data.trailerId,
            movieId: data.movieId,
            backdrop_path: data?.backdrop_path,
            name: data?.original_name || data?.name || data?.title,
            release_date: data?.release_date || data?.first_air_date,
            overview: data.overview,
            vote_average: data.vote_average
        }
        const savedWishList = await backend.post('/wishlist/addwishlist', newData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': authToken,
                }
            }
        )
        if (savedWishList) {
            fetchMoviesData('wishList')
        }
    }
    const deleteWishList = async (movieId) => {
        await backend.delete(`/wishlist/deletewishlist/${movieId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': authToken,
                }
            }
        )
        const updatedData = user.wishList.filter((item) => item.movieId !== movieId)
        dispatch({
            ...user,
            type: 'Set_User',
            wishList: updatedData
        })
    }

    return <VideoManagerContext.Provider value={{ addHistory, deleteHistory, addWishList, deleteWishList }}>
        {props.children}
    </VideoManagerContext.Provider>
}

export const useVideoManagerState = () => useContext(VideoManagerContext)