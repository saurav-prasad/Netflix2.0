import React, { useEffect, useState } from 'react'
import YouTube from 'react-youtube'
import './videoDetail.css'
import FavoriteTwoToneIcon from '@mui/icons-material/FavoriteTwoTone';
import requests from '../../requests';
import { useNavigate, useParams } from 'react-router-dom';
import KeyboardBackspaceRoundedIcon from '@mui/icons-material/KeyboardBackspaceRounded';
import movieTrailer from 'movie-trailer';
import { LinearProgress } from '@mui/material';
import { useVideoManagerState } from '../../context/videoManagerContext/VideoManagerContext';
import instance from '../../axios';
import Nav from '../nav/Nav';
import Menu from '../menu/Menu';

const imageUrl = 'https://image.tmdb.org/t/p/original'

function VideoDetail({ showAlert, setAlertText }) {
  const navigate = useNavigate()
  const { fetchMoviesData, addHistory, addWishList } = useVideoManagerState()
  const [videoId, setVideoId] = useState()
  const params = useParams()
  const [Movies, setMovies] = useState([])
  const [videoHeight, setVideoHeight] = useState(260)
  const [progress, setprogress] = useState(false)
  const [movieInfo, setMovieInfo] = useState({})

  const opts = {
    height: videoHeight,
    width: '100%',
    playerVars: {
      autoplay: 1,
    },
  };

  useEffect(() => {
    if (window.innerWidth >= 500) {
      setVideoHeight('450')
    }
    else if (window.innerWidth < 500) {
      setVideoHeight('260')
    }
  }, [])

  useEffect(() => {
    async function fetchData() {
      try {
        const movieIndex = Math.floor(Math.random() * Object.keys(requests).length)
        const request = await instance.get(Object.values(requests)[movieIndex])
        setMovies(request.data.results)

        let movieData = await instance.get(`/movie/${params.movieid}?api_key=${process.env.REACT_APP_API}`)
        movieData = movieData.data
        setMovieInfo(movieData)
        setVideoId(params.trailerid)
        console.log(movieData);
        const a = {
          movieId: params.movieid,
          trailerId: params.trailerid,
          backdrop_path: movieData?.backdrop_path,
          name: movieData?.original_name || movieData?.name || movieData?.title,
          release_date: movieData?.release_date || movieData?.first_air_date,
          overview: movieData?.overview,
          vote_average: movieData?.vote_average
        }
        if (localStorage.getItem('auth-token')) {
          addHistory(a)
        }
      } catch (err) { console.log(err); }
    }
    fetchData()
  }, [params.trailerid, params.movieid])

  const addToWishList = async () => {
    const a = {
      movieId: params.movieid,
      trailerId: params.trailerid,
      backdrop_path: movieInfo?.backdrop_path,
      name: movieInfo?.original_name || movieInfo?.name || movieInfo?.title,
      release_date: movieInfo?.release_date || movieInfo?.first_air_date,
      overview: movieInfo?.overview,
      vote_average: movieInfo?.vote_average
    }
    if (localStorage.getItem('auth-token')) {
      addWishList(a)
      setAlertText('Added to wishlist')
      showAlert(true)
    }
    else {
      showAlert(true)
      setAlertText('Sign-in first')
    }

  }

  const nextMovie = (data) => {
    try {
      setprogress(true)
      movieTrailer(data?.original_name || data?.name || data?.title)
        .then((value) => {
          const url = new URLSearchParams(new URL(value).search)
          navigate(`/video/${data.id}/${url.get('v')}`)
          setprogress(false)
        })
        .catch((e) => {
          setprogress(false)
          showAlert(true)
        })
    } catch (err) { console.log(err); }
  }

  return (
    <div className='vdoDtl'>
      <div className={`vdoDtlNav flexCenter navColor`}>
        <div className='flexCenter' style={{ flexDirection: 'row' }}>
          < KeyboardBackspaceRoundedIcon fontSize='large' onClick={() => navigate(-1)} className='cursorPointer' />
          <img onClick={() => navigate('/')} src="https://about.netflix.com/images/logo.png" className='cursorPointer netflixLogo' alt="" />
        </div>
        <Menu />
      </div>

      <YouTube
        className='vdoDtlVideo'
        videoId={videoId && videoId}
        opts={opts}
      />
      <div className='vdoDtlDetailBox'>
        <div className='vdoDtlTitleBox'>
          <h1 className='vdoDtlTitle'> {movieInfo?.original_name || movieInfo?.name || movieInfo?.title}</h1>
          <FavoriteTwoToneIcon onClick={addToWishList} className='vdoDtlLike' fontSize='large' />
        </div>

        {movieInfo.tagline && <p className='vdoDtlDetail text-xl text-blue-300'>Tagline: "{movieInfo?.tagline}"</p>}
        <p className='vdoDtlDetail'>{movieInfo?.overview}</p>
        <p className='vdoDtlRating'>Rating: <span>{movieInfo?.vote_average} points</span></p>
        <p className='vdoDtlDate'>Genres: <span>{movieInfo?.genres?.map((a) => <span className='vdoDtlGenres'>{a.name}</span>)} </span></p>
        <p className='vdoDtlDate'>Release Data: {movieInfo?.release_date || movieInfo?.first_air_date}</p>
      </div>
      <div className='vdoDtlVideos'>
        {Movies &&
          Movies.map(data =>
            <div key={data.id} onClick={() => { nextMovie(data); }} className='vdoDtlVideoImageBox'>
              <img
                key={data.id}
                className="vdoDtlVideoImage cursorPointer"

                src={`${imageUrl}${data?.backdrop_path}` ?? 'https://thumbs.gfycat.com/BackIllinformedAsianelephant-size_restricted.gif'}

                alt={data?.name}
              />
              <p className='vdoDtlVideoImageTitle'>{data?.original_name || data?.name || data?.title}</p>
            </div>
          )
        }
        {
          progress &&
          <LinearProgress style={{ marginBottom: '7px', backgroundColor: "#dc191f", color: '#dc191f' }} color='inherit' />
        }
      </div>
    </div>
  )
}

export default VideoDetail