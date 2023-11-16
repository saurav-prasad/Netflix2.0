import React, { useEffect, useState } from 'react'
import './search.css'
import { LinearProgress, Skeleton, TextField } from '@mui/material'
import { useHomeState } from '../../context/homeContext/HomeState'
import requests from '../../requests'
import { useNavigate, useParams } from 'react-router-dom'
import instance from '../../axios'
import movieTrailer from 'movie-trailer'
const imageUrl = 'https://image.tmdb.org/t/p/original'

const movieCategory = {
    fetchActionMovies: 'Action',
    fetchComedyMovies: 'Comedy',
    fetchDocumentaries: 'Documentaries',
    fetchHorrorMovies: 'Horror',
    fetchNetflixOriginals: 'Netflix Originals',
    fetchRomanceMovies: 'Romance',
    fetchTopRated: 'Top Rated',
    fetchTrending: 'Trending Now'
}

function Search({ showAlert, setAlertText }) {
    const [preValue, setPreValue] = useState(0)
    const [progress, setpPogress] = useState(true)
    const [data, dispatch] = useHomeState()
    const [movies, setMovies] = useState([])
    const [allMovie, setAllMovie] = useState([])
    const navigate = useNavigate()

    const removeDuplicateObjects = (arr) => {
        // Create an empty array to store unique objects
        const uniqueObjects = [];

        // Create an empty object to keep track of encountered objects
        const encounteredObjects = {};

        // Use the `filter` method to iterate over the array
        arr.filter((currentObject) => {
            // Convert the current object to a string for comparison
            const objectString = JSON.stringify(currentObject);

            // Check if we've encountered this object before
            if (!encounteredObjects[objectString]) {
                uniqueObjects.push(currentObject); // Add the unique object to the new array
                encounteredObjects[objectString] = true; // Mark this object as encountered
            }
        });

        return uniqueObjects;
    }

    useEffect(() => {
        async function fetchData() {
            // Creating a copy of the current movies array
            let updatedMovies = [...movies];

            for (const key in requests) {
                const categoryKey = movieCategory[key];

                if (!Object.keys(data).includes(categoryKey)) {
                    // console.log("if");
                    try {
                        const response = await instance.get(requests[key]);
                        const newMovies = response.data.results;
                        updatedMovies = [...updatedMovies, ...newMovies];

                        // Update the data state
                        dispatch({
                            ...data,
                            type: "Set_Data",
                            key: categoryKey,
                            value: newMovies,
                        });
                        // setpPogress(false)
                    } catch (error) {
                        // Handle errors
                        console.error("Error fetching data:", error);
                    }
                }
                else if (Object.keys(data).includes(movieCategory[key])) {
                    // console.log("else");
                    const moviedata = data[movieCategory[key]]
                    updatedMovies = [...updatedMovies, ...moviedata];
                    // setpPogress(false)
                }
            }
            const uniqueObjects = removeDuplicateObjects(updatedMovies);
            setMovies(uniqueObjects)
            setAllMovie(uniqueObjects);
            setpPogress(false)
        }

        fetchData()
    }, []);

    const nextMovie = (data) => {
        try {
            movieTrailer(data?.original_name || data?.name || data?.title)
                .then((value) => {
                    const url = new URLSearchParams(new URL(value).search)
                    navigate(`/video/${data.id}/${url.get('v')}`)
                    window.scrollTo(0, 0);
                })
                .catch((e) => {
                    showAlert(true)
                    setAlertText('Trailer not available')
                })
        } catch (err) { console.log(err); }
    }

    let timer = null
    const filtr = (filterValue) => {
        if (timer !== null) clearTimeout(timer)
        timer = setTimeout(() => {
            setMovies(allMovie.filter((data) => {
                const a = data?.title?.toLowerCase()
                const b = data?.original_title?.toLowerCase()
                const c = data?.overview?.toLowerCase()
                const d = data?.tagline?.toLowerCase()
                const e = data?.title?.toLowerCase()
                return a?.includes(filterValue) || b?.includes(filterValue) || c?.includes(filterValue) || d?.includes(filterValue) || e?.includes(filterValue)
            }))
            timer = null
        }, 1000)
    }

    const filterByWords = (value) => {
        const filterValue = value.toLowerCase()
        if (filterValue.length >= 1 && filterValue.length > preValue) {
            filtr(filterValue)
            setPreValue(filterValue.length)
        }
        else if (filterValue.length < preValue) {
            filtr(filterValue)
            setPreValue(filterValue.length)
        }
        else if (filterValue.length === 0) {
            setMovies(allMovie)
        }

    }

    const trim = (str, n) => {
        return str?.length > n ? str.slice(0, str.charAt(n) === " " ? n - 1 : n) + "..." : str
    }

    return (
        <div className='search'>
            <div className="flex grow justify-end px-3 searchInputBox">
                <input
                    onChange={e => filterByWords(e.target.value)}
                    className="searchInput flex w-full h-10 w-[250px] rounded-md bg-gray-100 px-3 py-2 text-sm placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-black/30 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 "
                    type="text"
                    placeholder="Search Movies..."
                ></input>
            </div>
            {progress ?
                <div className='searchVideos vdoDtlVideos'>
                    {Array.from({ length: 8 }).map((_) =>
                        <>
                            <div>
                                <Skeleton className='searchSkele' variant="rectangular" height={160} />
                                <Skeleton className='searchSkele mt-2' variant="rectangular" height={15} />
                            </div>
                        </>
                    )}
                </div> :

                movies.length > 0 ?
                    <>
                        <div className='searchVideos vdoDtlVideos'>
                            {movies.map(data =>
                                <div key={data.id} onClick={() => nextMovie(data)} className='vdoDtlVideoImageBox'>
                                    <img
                                        className="vdoDtlVideoImage cursorPointer"

                                        src={`${imageUrl}${data?.backdrop_path}` ?? 'https://thumbs.gfycat.com/BackIllinformedAsianelephant-size_restricted.gif'}

                                        alt={data?.name}
                                    />
                                    <p className='searchTitle vdoDtlVideoImageTitle'>{trim(data?.original_name || data?.name || data?.title, 20)}</p>

                                </div>
                            )}

                        </div>
                    </> :
                    <>
                        <h1 className='text-4xl text-center w-full mt-52'>Movies not available 😕</h1>
                    </>

            }
        </div>
    )
}

export default Search