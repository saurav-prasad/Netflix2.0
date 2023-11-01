import React, { useEffect, useState } from 'react'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import './signup.css'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUserDataState } from '../../context/userDataContext/UserDataState';
import { backend } from '../../axios';
import { useVideoManagerState } from '../../context/videoManagerContext/VideoManagerContext';

function Signup() {
    const [data, setData] = useState({ name: '', email: "", password: "" })
    const [user, dispatch] = useUserDataState()
    const location = useLocation()
    const navigate = useNavigate()
    const [error, setError] = useState()
    let pathnames = location.pathname.split('/').filter((x) => x);
    pathnames = pathnames[0]

    const onChange = (e) => {
        setData({
            ...data,
            [e.target.id]: e.target.value
        })
    }
    useEffect(() => {
        if (localStorage.getItem('auth-token')) {
            navigate('/')
        }
    }, [])

    const onSubmit = async (e) => {
        setError()
        e.preventDefault()
        try {
            if (pathnames === 'signin') {
                const userData = await backend.post('/auth/loginuser', {
                    "email": data.email,
                    "password": data.password,
                })
                dispatch({
                    ...user,
                    type: 'Set_User',
                    user: userData.data.user
                })
                localStorage.setItem("auth-token", userData.data.token)
                navigate('/')
            }
            else if (pathnames === 'signup') {
                const userData = await backend.post('/auth/createuser', data)
                // console.log(userData);
                dispatch({
                    ...user,
                    type: 'Set_User',
                    user: userData.data.data
                })
                localStorage.setItem("auth-token", userData.data.authToken)
                navigate('/')
            }
        } catch (error) {
            console.log(error.response.data.message);
            setError(error.response.data.message)
        }

    }
    const testUserLogin = async (e) => {
        setError()
        e.preventDefault()
        try {
            const userData = await backend.post('/auth/loginuser', {
                "email": "test@netflix.com",
                "password": "testnetflix",
            })
            dispatch({
                ...user,
                type: 'Set_User',
                user: userData.data.user
            })
            //fetchUserData(userData.data.token)
            // fetchMoviesData('history')
            localStorage.setItem("auth-token", userData.data.token)
            navigate('/')

        } catch (error) {
            console.log(error.response.data.message);
            setError(error.response.data.message)
        }
    }
    return (
        <section className='flexCenter test'>
            <div className="flex items-center justify-center px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
                <div className="testForm rounded-md py-12 px-12 p xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md">
                    <div className=" mb-2 flex justify-center">
                        <Link to='/'>
                            <img className='w-44' src="https://about.netflix.com/images/logo.png" alt="" />
                        </Link>
                    </div>
                    <form onSubmit={onSubmit} className="mt-8 sm:w-80 w-60">
                        <div className="space-y-5">
                            {(pathnames === 'signup') && <div>
                                <div className="mt-2">
                                    <input
                                        onChange={onChange}
                                        className="testFromInput flex h-12 w-full rounded-md border border-gray-300 bg-transparent px-3 py-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                                        type="text"
                                        placeholder="Full Name"
                                        id="name"
                                    ></input>
                                </div>
                            </div>}
                            <div>
                                <div className="mt-2">
                                    <input
                                        onChange={(e) => onChange(e)}
                                        className="testFromInput flex h-12 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                                        type="email"
                                        placeholder="Email"
                                        id="email"
                                    ></input>
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center justify-between">
                                </div>
                                <div className="mt-2">
                                    <input
                                        onChange={(e) => onChange(e)}
                                        className="testFromInput flex h-12 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                                        type="password"
                                        placeholder="Password"
                                        id="password"
                                    ></input>
                                </div>
                            </div>
                            <span className='text-red-500 font-light text-sm'>{error}</span>
                            <div>
                                <button
                                    type="submit"
                                    className="inline-flex w-full items-center justify-center rounded-md px-3.5 py-2.5 font-medium leading-7 text-white hover:bg-black/80 testButton"
                                >
                                    {pathnames === 'signup' ? "Sign Up" : "Sign In"} <ArrowForwardRoundedIcon className="ml-2" size={16} />
                                </button>
                            </div>
                            <div>
                                <button
                                    type="button"
                                    onClick={testUserLogin}
                                    className="inline-flex w-full items-center justify-center rounded-md px-3.5 py-1 font-medium leading-7 text-white hover:bg-black/80 testButton testUserButton"
                                >
                                    Sign In as Test User <ArrowForwardRoundedIcon className="ml-2" size={16} />
                                </button>
                            </div>
                        </div>
                    </form>
                    <p className="mt-5 text-center text-gray-400 text-white">
                        {pathnames === 'signup' ? "Already Registered" : "New to Netflix"}?{' '}
                        <Link
                            to={pathnames === 'signup' ? '/signin' : '/signup'}

                        >
                            <span className="font-light text-gray-400 transition-all duration-200 hover:underline">
                                {pathnames === 'signup' ? "Sign in" : "Sign Up Now"}
                            </span>
                        </Link>
                    </p>
                    <div className="mt-3 space-y-3">
                    </div>
                </div>
            </div >
        </section >
    )
}

export default Signup