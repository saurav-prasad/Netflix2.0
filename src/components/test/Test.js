import axios from 'axios'
import React from 'react'

function Test() {
    const clicked = async (e) => {
        e.preventDefault()

        try {

            const data = await axios.post('http://localhost:5000/api/auth/loginuser', {
                "email": "saurav@gmail.com",
                "password": "18042003"
            })
            console.log(data);


            // fetch(`http://localhost:5000/api/auth/loginuser`, {
            //     method: 'GET',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify({
            //         "email": "saurav@gmail.com",
            //         "password": "18042003"
            //     })
            // }).then((a) => { console.log(a); }).catch(err => { console.log(err); })


        } catch (error) {
            console.log(error.response.data);
        }
    }
    return (
        <div>
            <button onClick={clicked}>Click me</button>
        </div>
    )
}

export default Test