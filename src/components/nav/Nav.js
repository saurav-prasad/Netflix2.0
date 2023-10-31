import React, { useEffect, useState } from 'react'
import './nav.css'

function Nav() {
    const [handleShow, sethandleShow] = useState(false)

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
        // <div style={{ backgroundColor: `${handleShow && '#141414'}` }} className='nav flexCenter'>
        <div className={`nav flexCenter ${handleShow && 'navColor'}`}>
            <img src="https://about.netflix.com/images/logo.png" className='netflixLogo' alt="" />
            <img src="https://pbs.twimg.com/media/Dj7pdk_XoAEWZ9f?format=jpg&name=360x360" alt="" className='userLogo cursorPointer' />
        </div>
    )
}

export default Nav