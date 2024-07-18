import React from 'react'
import LoadingIcon from "../../assets/loading.gif"
import "./Loading.css"

const Loading = () => {
    return (
        <img src={LoadingIcon} alt="Spinning Tom Nook Loading Icon" className='loadingSpinner' />
    )
}

export default Loading;
