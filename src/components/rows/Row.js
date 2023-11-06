import React, { useEffect, useState } from 'react'
import './row.css'
import movieTrailer from 'movie-trailer';
import { LinearProgress, Skeleton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import instance from '../../axios';
import { useHomeState } from '../../context/homeContext/HomeState';

const imageUrl = 'https://image.tmdb.org/t/p/original'

function Row({ title, fetchUrl, isLargeRow, showAlert, setAlertText }) {
    const navigate = useNavigate()
    const [counter, setcounter] = useState()
    const [progress, setprogress] = useState(false)
    const [data, dispatch] = useHomeState()
    const [skele, setSkele] = useState(true)
    const getMovie = async (data) => {
        if (data?.id === counter) {
            setcounter()
        }
        else {
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
            setcounter(data.id)
        }
    }

    const [Movies, setMovies] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            if (data[title]) {
                setMovies(data[title])
            }
            else {
                const request = await instance.get(fetchUrl)
                 setMovies(request.data.results)
                dispatch({
                    ...data,
                    type: "Set_Data",
                    key: title,
                    value: request.data.results,
                })
            }
             setSkele(false)
        }
        fetchData()
    }, [fetchUrl])


    return (
        <div className='row'>
            <h1 className='rowTitle'>{title}</h1>


            {skele ?
                <div className='rowSkeleBox'>

                    {Array.from({ length: 10 }).map((_) => <Skeleton className='rowSkele' height={200}/>)}
                </div>
                :
                <div className='rowPosterConatainer'>
                    {Movies.map(data =>
                        <img
                            key={data.id}
                            className={`rowImage cursorPointer ${(data?.id === counter) && 'clickedImage'} ${isLargeRow && "rowLargeImage"}`}

                            src={`${imageUrl}${isLargeRow ? data.poster_path : data.backdrop_path}` ?? 'https://i.pinimg.com/originals/49/23/29/492329d446c422b0483677d0318ab4fa.gif'}

                            onClick={() => { getMovie(data); }}
                            alt={data.name}
                        />
                    )}
                </div>
            }
            {
                progress &&
                <LinearProgress style={{ marginBottom: '7px', backgroundColor: "#dc191f", color: '#dc191f' }} color='inherit' />
            }
        </div>
    )
}

export default Row