import React from 'react'
import HomepageNav from '../comp/homepageNav'
import Footer from '../comp/landingPage/footer'
import Options from '../comp/options'

const CheckInPage=()=>{
return(
    <div className="checkInPage">
       <HomepageNav/>
       <h2>CHECK INTO YOUR DREAM LOCATION</h2>
       <Options option={'Check in'} optroute={'/checkinResults'}/>
       <Footer/>
    </div>)
}

export default CheckInPage