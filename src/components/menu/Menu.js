import React, { useEffect, useState } from 'react'
import { useUserDataState } from '../../context/userDataContext/UserDataState'
import { Link,  } from 'react-router-dom';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';

function Menu() {
    const [toggleMenu, setToggleMenu] = useState(false)
    const [checkUser, setCheckUser] = useState()
    const [user, dispatch] = useUserDataState()
    const logOut = () => {
        localStorage.removeItem('auth-token')
        dispatch({ type: "UnSet_User" })
        setCheckUser()
    }
    useEffect(() => {
        // console.log(user);
        if (user) {
            setCheckUser(user.user?.name)
        }
    }, [user])

    return (
        <div className='relative'>
            <img onClick={() => setToggleMenu(!toggleMenu)} src="https://pbs.twimg.com/media/Dj7pdk_XoAEWZ9f?format=jpg&name=360x360" alt="" className='userLogo cursorPointer ' />

            {
                toggleMenu && <div className='z-20 rounded absolute px-5 pt-10 pb-5 flex justify-start items-start w-40 top-0 right-0 bg-gray-700 text-white' style={{flexDirection:'column'}}>

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
                            <span className='font-light my-2 w-full'>
                                👋 Hi {checkUser}
                            </span>
                            <span onClick={() => { logOut(); setToggleMenu(!toggleMenu) }}
                                className='cursorPointer font-light my-2 w-full'>
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
    )
}

export default Menu