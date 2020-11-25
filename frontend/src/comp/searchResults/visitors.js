import React from 'react'
import { Link } from 'react-router-dom'
import DateRating from '../dateRating'
import PropTypes from 'prop-types'
import '../../css/dateRating.css'

const Visitors=({username, date, phone})=>{
return(
   <div className="visitor">
        <img src='/imgs/user_image_bitmap.svg'></img>
        <div className='visitor-info'>
            <Link to='/visitorProfile' style={{ textDecoration: 'none' }}>
                <label id="username">{username}</label>
            </Link>
            <DateRating date={date} size={14}/>
            <label>Call: {phone}</label>      
        </div>
    </div>
)
}

Visitors.propTypes={
    username : PropTypes.string,
    date : PropTypes.string,
    phone : PropTypes.number
}

export default Visitors