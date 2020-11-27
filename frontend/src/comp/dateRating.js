import React from 'react'
import PropTypes from 'prop-types'
import Ratings from './ratings'


const DateRating = ({date,size,rating})=>{
    return(
        <div className="date-rating">
            <label id="date">{date}</label>
            <Ratings size={size} value={rating}/>
        </div>
    )
}

DateRating.propTypes={
 date : PropTypes.string,
 size : PropTypes.number
}

export default DateRating