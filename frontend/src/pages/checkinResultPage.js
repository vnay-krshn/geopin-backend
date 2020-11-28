import React, { useContext } from 'react'
import HomepageNav from '../comp/homepageNav'
import CheckinMap from '../comp/CheckinMap'
import '../css/review.css'

const CheckinResults=()=>{
        
    return(
    <div className='checkinResults'>
        <div className="checkin-blur">
            <HomepageNav/>
            <CheckinMap/>
        </div>
    </div>)
}

export default CheckinResults