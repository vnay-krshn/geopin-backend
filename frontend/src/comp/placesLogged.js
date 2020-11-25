import React from 'react'
import PropTypes from 'prop-types'
import DateRating from './dateRating'

const PlacesLogged =({location, place, description,date})=>{
    return(
        <div className="placesLogged">
            <div className="placesLogged-header">
                <div className="region">
                    <label>{location}</label>
                    <label>{place}</label>
                </div>
                <DateRating date={date} size={11}/>
            </div>
            <img src='/imgs/side_image-2x.png'></img>
            <div className="placesLogged-descr">
                <p>{description}</p>
            </div>
        </div>
    )
}

PlacesLogged.propTypes={
    location : PropTypes.string,
    place : PropTypes.string,
    decription : PropTypes.string,
    date : PropTypes.string
}

export default PlacesLogged