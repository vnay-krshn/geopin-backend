import React, { useState } from 'react'
import {FaStar} from 'react-icons/fa'
import PropTypes from 'prop-types'
import '../../src/css/checkinRatings.css'

const CheckinRating=({selectRating,value})=>{

    const rating = value
    
    const showRating=(r)=>{
       selectRating(r)
    }
    
    return(
    <div className="rate">
        {[...Array(5)].map((star, i,key)=>{
            const ratingValue = i + 1
            return(
                <label key={i}>
                    <input 
                    type="radio" 
                    name="rating" 
                    value={ratingValue}
                    >
                    </input>
    
                    <FaStar
                    className="star"
                    color={ratingValue <= rating ? '#00d3b8' : '#e4e5e9'}
                    size={15}
                    onClick={()=>showRating(ratingValue)}
                    />
                </label>
            )
        })}
    </div>)
    }
    
    CheckinRating.propTypes={
        size : PropTypes.number
    }
    

    CheckinRating.propTypes={
    size : PropTypes.number
}

export default  CheckinRating