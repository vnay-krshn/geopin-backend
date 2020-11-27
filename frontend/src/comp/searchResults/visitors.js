import React,{useContext, useEffect} from 'react'
import { Link } from 'react-router-dom'
import DateRating from '../dateRating'
import PropTypes from 'prop-types'
import '../../css/dateRating.css'
import {OptionsContext} from '../optionsContext'

const Visitors=({data})=>{

const {visitorId} = useContext(OptionsContext)
const[getUser, setUserId] = visitorId

var d = new Date(data.date);
var day = ((d.toString()).split(" "))[1]
var month = ((d.toString()).split(" "))[2]
var year = ((d.toString()).split(" "))[3]
var parsedDate = day + " " + month + " " + year

return(
   <div className="visitor">
        <img src='/imgs/user_image_bitmap.svg'></img>
        <div className='visitor-info'>
            <Link to='/visitorProfile' onClick={()=>setUserId(data.user_id)} style={{ textDecoration: 'none' }}>
                <label id="username">{data.name}</label>
            </Link>
            <DateRating date={parsedDate} size={14} rating={data.rating}/>
            <label>Call: {data.phone}</label>      
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