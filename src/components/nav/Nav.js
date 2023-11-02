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
import Menu from '../menu/Menu';

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
            <Menu/>
        </div>
    )
}

export default Nav