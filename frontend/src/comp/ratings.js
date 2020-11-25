import React, { useState } from 'react'
import {FaStar} from 'react-icons/fa'
import PropTypes from 'prop-types'
import '../../src/css/ratings.css'

const Ratings=({size, value})=>{

const rating = value

return(
<div className="rate">
    {[...Array(5)].map((star,i)=>{
        const ratingValue = i + 1        
        return(
               <label key={ratingValue}>
                <FaStar
                className="star"
                color={ratingValue <= rating ? '#00d3b8' : '#e4e5e9'}
                size={size}
                />
            </label>
        )
    })}
</div>)
}

Ratings.propTypes={
    size : PropTypes.number
}

export default Ratings