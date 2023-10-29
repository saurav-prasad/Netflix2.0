import React, { useEffect, useState } from 'react'
import './row.css'
import axios from '../../axios'
import YouTube from 'react-youtube';
import movieTrailer from 'movie-trailer';
import { LinearProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useVideoDetailState } from '../../context/videoDetailContext/VideoDetailContext';

const imageUrl = 'https://image.tmdb.org/t/p/original'

function Row({ title, fetchUrl, isLargeRow, showAlert }) {
    const { setVideo, VideoDetailInfo } = useVideoDetailState()
    const navigate = useNavigate()
    const [trailer, settrailer] = useState()
    const [counter, setcounter] = useState()
    const [progress, setprogress] = useState(false)
    const opts = {
        height: '400',
        width: '100%',
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 1,
        },
    };
    const getMovie = async (data) => {
        if (trailer && (data?.id === counter)) {
            setcounter()
            settrailer()
        }
        else {
            setprogress(true)
            movieTrailer(data?.original_name || data?.name || data?.title)
                .then((value) => {
                    const url = new URLSearchParams(new URL(value).search)
                    settrailer(url.get('v'))
                    // console.log(url.get('v'));
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

    const [Movies, setMovies] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            const request = await axios.get(fetchUrl)
            // console.log(request.data.results);
            setMovies(request.data.results)
        }
        fetchData()
    }, [fetchUrl])


    return (
        <div className='row'>
            <h1 className='rowTitle'>{title}</h1>
            <div className='rowPosterConatainer'>
                {Movies &&
                    Movies.map(data =>
                        <img
                            key={data.id}
                            className={`rowImage cursorPointer ${(trailer && (data?.id === counter)) && 'clickedImage'} ${isLargeRow && "rowLargeImage"}`}

                            src={`${imageUrl}${isLargeRow ? data.poster_path : data.backdrop_path}` ?? 'https://thumbs.gfycat.com/BackIllinformedAsianelephant-size_restricted.gif'}

                            onClick={() => { getMovie(data); setVideo(data) }}
                            alt={data.name}
                        />
                    )
                }
            </div>
            {
                progress &&
                <LinearProgress style={{ marginBottom: '7px', backgroundColor: "#dc191f", color: '#dc191f' }} color='inherit' />
            }
            {/* {
                trailer &&
                <YouTube
                    videoId={trailer ?? 'https://thumbs.gfycat.com/BackIllinformedAsianelephant-size_restricted.gif'}
                    opts={opts}
                />
            } */}
        </div>
    )
}

export default Row