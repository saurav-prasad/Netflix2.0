import React, { useEffect, useState } from 'react'
import './nav.css'
import KeyboardBackspaceRoundedIcon from '@mui/icons-material/KeyboardBackspaceRounded';
import { Link, useNavigate } from 'react-router-dom';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useUserDataState } from '../../context/userDataContext/UserDataState';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';

function Nav({ showBackButton }) {
    const [handleShow, sethandleShow] = useState(false)
    const [toggleMenu, setToggleMenu] = useState(false)
    const [checkUser, setCheckUser] = useState()
    const [user, dispatch] = useUserDataState()
    const logOut = () => {
        localStorage.removeItem('auth-token')
        dispatch({ type: "UnSet_User" })
        setCheckUser()
    }

    const navigate = useNavigate()
    useEffect(() => {
        try {
            const handleScroll = () => {
                if (window.scrollY > 100) {
                    sethandleShow(true);
                } else {
                    sethandleShow(false);
                }
            };

            window.addEventListener('scroll', handleScroll);

            return () => {
                window.removeEventListener('scroll', handleScroll);
            };
        } catch (error) {
            console.log(error);
        }

    }, [])
    useEffect(() => {
        // console.log(user);
        if (user) {
            setCheckUser(user.user?.name)
        }
    }, [user])

    return (
        <div className={`nav flexCenter ${handleShow && 'navColor'}`}>
            <div className='flexCenter' style={{ flexDirection: 'row' }}>
                {
                    showBackButton &&
                    < KeyboardBackspaceRoundedIcon fontSize='large' onClick={() => navigate(-1)} className='cursorPointer' />
                }
                <img onClick={() => navigate('/')} src="https://about.netflix.com/images/logo.png" className='cursorPointer netflixLogo' alt="" />
            </div>
            <div className='relative'>
                <img onClick={() => setToggleMenu(!toggleMenu)} src="https://pbs.twimg.com/media/Dj7pdk_XoAEWZ9f?format=jpg&name=360x360" alt="" className='userLogo cursorPointer' />

                {
                    toggleMenu && <div className='transition-all duration-700 rounded absolute px-5 pt-10 pb-5 flex flex-col justify-start items-start w-40 top-0 right-0 bg-gray-700 text-white'>

                        <CloseRoundedIcon onClick={() => setToggleMenu(!toggleMenu)} className='cursorPointer absolute right-3 top-3' />
                        <Link to="/" className=' my-3 w-full'>
                            <span onClick={() => setToggleMenu(!toggleMenu)} className='cursorPointer font-light'>
                                <HomeRoundedIcon fontSize='small' className='mr-1' />Home
                            </span>
                        </Link>
                        <Link to="/history" className=' my-3 w-full'>
                            <span onClick={() => setToggleMenu(!toggleMenu)} className='cursorPointer font-light'>
                                <HistoryRoundedIcon fontSize='small' className='mr-1' />History
                            </span>
                        </Link>
                        <Link className='my-3 w-full' to="/wishlist">
                            <span onClick={() => setToggleMenu(!toggleMenu)} className='cursorPointer font-light '>
                                <FavoriteBorderRoundedIcon fontSize='small' className='mr-1' />Wishlist
                            </span>
                        </Link>
                        {checkUser ?
                            <>
                                <span className='font-light my-2'>
                                    👋 Hi {checkUser}
                                </span>
                                <span onClick={() => { logOut(); setToggleMenu(!toggleMenu) }}
                                    className='cursorPointer font-light my-2'>
                                    <LogoutRoundedIcon fontSize='small' className='mr-1' />Log out
                                </span>
                            </> :
                            <>
                                <Link to="/signin" className=' my-3 w-full'>
                                    <span onClick={() => { setToggleMenu(!toggleMenu) }}
                                        className='cursorPointer font-light'>
                                        <ArrowForwardRoundedIcon fontSize='small' className='mr-1' />Sign In
                                    </span>
                                </Link>
                            </>
                        }
                    </div>
                }
            </div>
        </div>
    )
}

export default Nav