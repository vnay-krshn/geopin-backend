import React, { useContext } from 'react'
import HomepageNav from '../comp/homepageNav'
import Maps from '../comp/CheckinMap'
import '../css/review.css'

const CheckinResults=()=>{
        
    return(
    <div className='checkinResults'>
        <div className="checkin-blur">
            <HomepageNav/>
            <Maps/>
        </div>
    </div>)
}

export default CheckinResults