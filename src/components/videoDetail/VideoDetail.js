import React, { useEffect, useState } from 'react'
import YouTube from 'react-youtube'
import './videoDetail.css'
import FavoriteTwoToneIcon from '@mui/icons-material/FavoriteTwoTone';
import requests from '../../requests';
import axios from '../../axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useVideoDetailState } from '../../context/videoDetailContext/VideoDetailContext';
import KeyboardBackspaceRoundedIcon from '@mui/icons-material/KeyboardBackspaceRounded';
import movieTrailer from 'movie-trailer';
import { LinearProgress } from '@mui/material';

const imageUrl = 'https://image.tmdb.org/t/p/original'

function VideoDetail({ showAlert }) {
  const navigate = useNavigate()
  const { setVideo, VideoDetailInfo } = useVideoDetailState()
  const [videoId, setVideoId] = useState()
  const params = useParams()
  const [Movies, setMovies] = useState([])
  const [videoHeight, setVideoHeight] = useState(350)
  const [trailer, settrailer] = useState()
  const [progress, setprogress] = useState(false)
  const [counter, setcounter] = useState()


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
      setVideoHeight('250')
    }
    console.log(VideoDetailInfo);
  }, [window.innerWidth])

  useEffect(() => {
    async function fetchData() {
      // console.log(params);
      setVideoId(params.id)
      const movieIndex = Math.floor(Math.random() * Object.keys(requests).length)
      const request = await axios.get(Object.values(requests)[movieIndex])
      setMovies(request.data.results)
    }
    fetchData()
  }, [params.id])

  const nextMovie = (data) => {
    if (trailer && (data?.id === counter)) {
      setcounter()
      settrailer()
    }
    else {
      setprogress(true)
      movieTrailer(data?.original_name || data?.name || data?.title)
        .then((value) => {
          setVideo(data)
          const url = new URLSearchParams(new URL(value).search)
          settrailer(url.get('v'))
          console.log(url.get('v'));
          navigate(`/video/${url.get('v')}`)
          setprogress(false)
        })
        .catch((e) => {
          setprogress(false)
          showAlert(true)
          settrailer()
        })
      setcounter(data.id)
    }
  }

  return (
    <div className='vdoDtl'>
      <div className='vdoDtlNav'>
        <div>
          <KeyboardBackspaceRoundedIcon fontSize='large' onClick={() => navigate(-1)} className='cursorPointer' />
          <img onClick={() => navigate('/')} src="https://about.netflix.com/images/logo.png" className='netflixLogo cursorPointer' alt="" />
        </div>
        <img src="https://pbs.twimg.com/media/Dj7pdk_XoAEWZ9f?format=jpg&name=360x360" alt="" className='userLogo' />

      </div>
      <YouTube
        className='vdoDtlVideo'
        videoId={videoId}
        opts={opts}
      />
      <div className='vdoDtlDetailBox'>
        <div className='vdoDtlTitleBox'>
          <h1 className='vdoDtlTitle'> {VideoDetailInfo?.original_name || VideoDetailInfo?.name || VideoDetailInfo?.title}</h1>
          <FavoriteTwoToneIcon className='vdoDtlLike' fontSize='medium' />
        </div>

        <p className='vdoDtlDetail'>{VideoDetailInfo?.overview}</p>
        <p className='vdoDtlRating'>Rating: {VideoDetailInfo?.vote_average}</p>
        <p className='vdoDtlDate'>Release Data: {VideoDetailInfo?.release_date || VideoDetailInfo?.first_air_date}</p>
      </div>
      <div className='vdoDtlVideos'>
        {Movies &&
          Movies.map(data =>
            <div key={data.id} onClick={() => { nextMovie(data); }} className='vdoDtlVideoImageBox'>
              <img
                key={data.id}
                className={`vdoDtlVideoImage cursorPointer
            `}
                // ${(trailer && (data?.id === counter)) && 'clickedImage'}

                src={`${imageUrl}${data.backdrop_path}` ?? 'https://thumbs.gfycat.com/BackIllinformedAsianelephant-size_restricted.gif'}

                alt={data.name}
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