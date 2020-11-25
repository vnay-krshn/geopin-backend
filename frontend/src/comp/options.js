import React from 'react'
import { Link } from 'react-router-dom'

const Options=({option, optroute})=>{

    return(
    <div>
        <div className="options">
            <input placeholder={option}></input>
            <Link to={optroute}>
                <button>{option}</button>
            </Link>
        </div>
    </div>)
}

export default Options