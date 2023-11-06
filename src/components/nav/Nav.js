import React, { useEffect, useState } from 'react'
import './nav.css'
import KeyboardBackspaceRoundedIcon from '@mui/icons-material/KeyboardBackspaceRounded';
import { useNavigate } from 'react-router-dom';
import Menu from '../menu/Menu';

function Nav({ showBackButton }) {
    const [handleShow, sethandleShow] = useState(false)

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

    return (
        <div className={`nav flexCenter ${handleShow && 'navColor'}`}>
            <div className='flexCenter' style={{ flexDirection: 'row' }}>
                {
                    showBackButton &&
                    < KeyboardBackspaceRoundedIcon fontSize='large' onClick={() => navigate(-1)} className='cursorPointer' />
                }
                <img onClick={() => navigate('/')} src="https://about.netflix.com/images/logo.png" className='cursorPointer netflixLogo' alt="" />
            </div>
            <Menu />
        </div>
    )
}

export default Nav