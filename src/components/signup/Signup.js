import React, { useState } from 'react'
import './signup.css'

function Signup() {
    const [data, setData] = useState({ email: '', password: '', name: '' })
    const onChange = () => {

    }
    return (
        <div className='signup'>
            <img className='signupImg' src="https://assets.nflxext.com/ffe/siteui/vlv3/00103100-5b45-4d4f-af32-342649f1bda5/64774cd8-5c3a-4823-a0bb-1610d6971bd4/IN-en-20230821-popsignuptwoweeks-perspective_alpha_website_medium.jpg" alt="" />
            <form className='signupForm'>
                <h1>Sign up</h1>
                <input type="text" name="" id="" placeholder='Name' />
                <input type="text" name="" id="" placeholder='Email' />
                <input type="text" name="" id="" placeholder='Password' />
                <button>Sign Up</button>
            </form>
        </div>
    )
}

export default Signup