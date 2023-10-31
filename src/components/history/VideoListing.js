import React, { useEffect, useState } from 'react'
import './videoListing.css'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import instance, { backend } from '../../axios';
import requests from '../../requests';
import { useLocation, useNavigate } from 'react-router-dom';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import FavoriteTwoToneIcon from '@mui/icons-material/FavoriteTwoTone';
import movieTrailer from 'movie-trailer';
import { useVideoDetailState } from '../../context/videoDetailContext/VideoDetailContext';
import { useVideoManagerState } from '../../context/videoManagerContext/VideoManagerContext';
import { useUserDataState } from '../../context/userDataContext/UserDataState';



function History() {
    const { addHistory, deleteHistory, addWishList, deleteWishList } = useVideoManagerState()
    const [user] = useUserDataState()
    const { setVideo, VideoDetailInfo } = useVideoDetailState()
    const [trailer, settrailer] = useState()
    const [counter, setcounter] = useState()
    const [Movies, setMovies] = useState([])
    const [textTrim, setTextTrim] = useState({ title: 10, desc: 50 })
    const imageUrl = 'https://image.tmdb.org/t/p/original'
    const location = useLocation()
    const pathnames = location.pathname.split('/').filter((x) => x);
    const navigate = useNavigate()

    useEffect(() => {
        if (window.innerWidth >= 750) {
            setTextTrim({ title: 50, desc: 250 })
        }
        else if (window.innerWidth < 750) {
            setTextTrim({ title: 15, desc: 30 })
        }
    }, [])

    useEffect(() => {
        ((pathnames[0] === 'history') &&
            setMovies(user.history)) ||
            ((pathnames[0] === 'wishlist') &&
                setMovies(user.wishList))
    }, [user])


    const trim = (str, n) => {
        return str?.length > n ? str.slice(0, str.charAt(n) === " " ? n - 1 : n) + "..." : str
    }


    const getMovie = (data) => {
        if (trailer && (data?.id === counter)) {
            setcounter()
            settrailer()
        }
        else {
            // setprogress(true)
            movieTrailer(data?.original_name || data?.name || data?.title)
                .then((value) => {
                    setVideo(data)
                    const url = new URLSearchParams(new URL(value).search)
                    settrailer(url.get('v'))
                    console.log(url.get('v'));
                    navigate(`/video/${url.get('v')}`)
                    // setprogress(false)
                })
                .catch((e) => {
                    // setprogress(false)
                    // showAlert(true)
                    settrailer()
                })
            setcounter(data.id)
        }
    }

    const deleteMovie = async (videoId) => {
        ((pathnames[0] === 'history') &&
            deleteHistory(videoId)) ||
            ((pathnames[0] === 'wishlist') &&
                deleteWishList(videoId))
    }

    return (
        <div className='history'>
            <h1 className='historyHeader'>
                {pathnames[0] === 'history' ? <>
                    Your History
                    <HistoryRoundedIcon fontSize='medium' style={{ marginLeft: '4px' }} />
                </> : <>
                    Your WishList
                    <FavoriteBorderRoundedIcon fontSize='medium' style={{ marginLeft: '4px' }} />
                </>}
            </h1>
            <div className='historyVideoMain'>
                {Movies &&
                    Movies.map((data) =>
                        <div key={data.id} className='historyVideoBox'>
                            <img className='historyImg cursorPointer'
                                src={`${imageUrl}${data.backdrop_path}` ?? 'https://thumbs.gfycat.com/BackIllinformedAsianelephant-size_restricted.gif'}
                                onClick={() => getMovie(data)}
                                alt={data?.name} />
                            <div className='historyVideoInfo'>
                                <div>
                                    <p className='historyVideoTitle'> {trim(data?.original_name || data?.name || data?.title, textTrim.title)}</p>
                                    <p className='historyVideoDesc'>{trim(data.overview, textTrim.desc)}</p>
                                </div>
                                {pathnames[0] === 'history' ?
                                    <CloseRoundedIcon onClick={() => deleteMovie(data.videoId)} className='cursorPointer' fontSize='large' />
                                    :
                                    <FavoriteTwoToneIcon onClick={() => deleteMovie(data.videoId)} className='historyVideoLike cursorPointer' fontSize='medium' />
                                }
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default History