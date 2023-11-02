import React, { useEffect, useState } from 'react'
import './banner.css'
import axios from '../../axios'
import requests from '../../requests'
import movieTrailer from 'movie-trailer'
import { LinearProgress } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const imageUrl = 'https://image.tmdb.org/t/p/original'

function Banner({ showAlert,setAlertText }) {
    const navigate = useNavigate()
    const [progress, setprogress] = useState(false)

    const getMovie = async (data) => {
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
                setAlertText("Trailer not available")
            })
    }

    const [Movies, setMovies] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            const request = await axios.get(requests.fetchNetflixOriginals)
            const data = request.data.results
            setMovies(data[Math.floor(Math.random() * data.length)])
        }
        fetchData()
    }, [])
    const trim = (str, n) => {
        return str?.length > n ? str.slice(0, str.charAt(n) === " " ? n - 1 : n) + "..." : str
    }

    return (
        <>
            <header style={{ backgroundImage: `url(${imageUrl}${Movies?.backdrop_path})` }} className='banner flexCenter'>
                <div className='bannerContainer flexCenter'>
                    <div>
                        <h1 className='bannerTitle'>
                            {Movies?.original_name || Movies?.name || Movies?.title}
                        </h1>
                        <div className='bannerDetail'>
                            <span className='bannerVote'>{Movies.vote_average} points</span>
                            <span className='bannerYear'>{Movies?.first_air_date?.slice(0, 4)}</span>
                        </div> 
                        <p className='bannerDesc'>{trim(Movies.overview, 180)}</p>
                        <button onClick={() => getMovie(Movies)} className='bg-white bannerButton flexCenter cursorPointer'>
                            ► Watch
                        </button>
                    </div>
                </div>
                <div className='bannerFooterGradient'></div>
            </header>

            {
                progress &&
                <LinearProgress style={{ marginBottom: '7px', backgroundColor: "#dc191f", color: '#dc191f' }} color='inherit' />
            }
        </>
    )
}

export default Banner