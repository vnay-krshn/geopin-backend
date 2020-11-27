import React from 'react'
import PropTypes from 'prop-types'
import DateRating from './dateRating'

const PlacesLogged =({data})=>{
    
    var d = new Date(data.date);
    var day = ((d.toString()).split(" "))[1]
    var month = ((d.toString()).split(" "))[2]
    var year = ((d.toString()).split(" "))[3]
    var parsedDate = day + " " + month + " " + year

    return(
        <div className="placesLogged">
            <div className="placesLogged-header">
                <div className="region">
                    <label>{data.location}</label>
                    <label>{data.city}</label>
                </div>
                <DateRating date={parsedDate} rating={data.rating} size={11}/>
            </div>
            <img src='/imgs/side_image-2x.png'></img>
            <div className="placesLogged-descr">
                <p>{data.review}</p>
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