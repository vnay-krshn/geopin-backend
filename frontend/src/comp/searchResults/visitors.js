import React from 'react'
import { Link } from 'react-router-dom'
import DateRating from '../dateRating'
import PropTypes from 'prop-types'
import '../../css/dateRating.css'

const Visitors=({username, date, phone,rating,key})=>{

var d = new Date(date);
var day = ((d.toString()).split(" "))[1]
var month = ((d.toString()).split(" "))[2]
var year = ((d.toString()).split(" "))[3]
var parsedDate = day + " " + month + " " + year

return(
   <div className="visitor">
        <img src='/imgs/user_image_bitmap.svg'></img>
        <div className='visitor-info'>
            <Link to='/visitorProfile' style={{ textDecoration: 'none' }}>
                <label id="username">{username}</label>
            </Link>
            <DateRating date={parsedDate} size={14} rating={rating}/>
            <label>Call: {phone}</label>      
        </div>
    </div>
)
}

Visitors.propTypes={
    username : PropTypes.string,
    date : PropTypes.string,
    phone : PropTypes.string
}

export default Visitors