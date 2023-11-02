import React from 'react'
import { Alert } from '@mui/material';
import './alrt.css'
function Alrt({alertText,showAlert}) {
    return (
        <>
            {showAlert &&
                <div div className='alert' >
                    <Alert className='alertContent' variant="filled" severity="error">
                        {alertText}
                    </Alert>
                </div>
            }
        </>
    )
}

export default Alrt