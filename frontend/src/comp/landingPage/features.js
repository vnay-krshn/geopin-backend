import React from 'react'
import PropTypes from 'prop-types'


const Features=({src, title, descr})=>{
    return(
    <div className="card">
            <img src={src}></img>
            <h4>{title}</h4>
            <p>{descr}</p>
    </div>)
}

Features.propTypes={
    src : PropTypes.string,
    title : PropTypes.string,
    descr: PropTypes.string
}

export default Features