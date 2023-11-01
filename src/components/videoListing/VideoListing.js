import React, { useEffect, useState } from 'react'
import './videoListing.css'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import FavoriteTwoToneIcon from '@mui/icons-material/FavoriteTwoTone';
import movieTrailer from 'movie-trailer';
import { useVideoManagerState } from '../../context/videoManagerContext/VideoManagerContext';
import { useUserDataState } from '../../context/userDataContext/UserDataState';
import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded';



function History({ showAlert }) {
    const { addHistory, deleteHistory, addWishList, deleteWishList, fetchMoviesData } = useVideoManagerState()
    const [user] = useUserDataState()
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
        const path = (pathnames[0] === 'wishlist') ? 'wishList' : 'history'
        if (user[path]) {
            ((pathnames[0] === 'history') &&
                setMovies(user?.history)) ||
                ((pathnames[0] === 'wishlist') &&
                    setMovies(user?.wishList))
        }
        else {
            fetchMoviesData(path)
        }
    }, [user, pathnames])


    const trim = (str, n) => {
        return str?.length > n ? str.slice(0, str.charAt(n) === " " ? n - 1 : n) + "..." : str
    }


    const getMovie = (data) => {

        movieTrailer(data?.original_name || data?.name || data?.title)
            .then((value) => {
                const url = new URLSearchParams(new URL(value).search)
                navigate(`/video/${data.movieId}/${url.get('v')}`)
            })
            .catch((e) => {
                showAlert(true)
            })
    }

    const deleteMovie = async (movieId) => {
        ((pathnames[0] === 'history') &&
            deleteHistory(movieId)) ||
            ((pathnames[0] === 'wishlist') &&
                deleteWishList(movieId))
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
            {localStorage.getItem('auth-token') ?
                <div className='historyVideoMain'>
                    {Movies?.length > 0 ?
                        Movies.map((data) =>
                            <div key={data.id} className='historyVideoBox'>
                                <img className={`historyImg cursorPointer && 'clickedImage'}`}
                                    src={`${imageUrl}${data.backdrop_path}` ?? 'https://thumbs.gfycat.com/BackIllinformedAsianelephant-size_restricted.gif'}
                                    onClick={() => getMovie(data)}
                                    alt={data?.name} />
                                <div className='historyVideoInfo'>
                                    <div>
                                        <p className='historyVideoTitle'> {trim(data?.original_name || data?.name || data?.title, textTrim.title)}</p>
                                        <p className='historyVideoDesc'>{trim(data.overview, textTrim.desc)}</p>
                                    </div>
                                    {pathnames[0] === 'history' ?
                                        <CloseRoundedIcon onClick={() => deleteMovie(data.movieId)} className='cursorPointer' fontSize='large' />
                                        :
                                        <FavoriteTwoToneIcon onClick={() => deleteMovie(data.movieId)} className='historyVideoLike cursorPointer' fontSize='medium' />
                                    }
                                </div>
                            </div>
                        ) :
                        <div className='flexCenter h-full'>
                            <h1 className='font-semibold text-3xl mt-28'>Your {pathnames} is empty</h1>
                        </div>
                    }
                </div> :
                <div className='flexCenter'>
                    <Link to='/signin'>
                        <h1 className='flex underline items-center font-bold text-2xl mb-12'>Sign In First <ArrowForwardRounded className='ml-2' /></h1>
                    </Link>
                </div>
            }
        </div>
    )
}

export default History