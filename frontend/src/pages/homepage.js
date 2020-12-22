import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import HomepageNav from '../comp/homepageNav'
import '../css/homePageNav.css'
import Footer from '../comp/landingPage/footer'
import Sidebar from '../comp/sidebar'
import { callbackPromise } from 'nodemailer/lib/shared'
import flash from 'express-flash'

const Homepage = () => {

 const [menuVisible, setMenuVisible] = useState(false)

 const checkMenuVisible=(e)=>{
    if(e===false){
        setMenuVisible(false)
    }
 }

    return (
        <div className='homepage'>
            <HomepageNav />
            <div className="home-display">
                <p>Do you need to check in your <strong>location</strong> or find a new <strong>destination</strong>?</p>
                <div className="home-options">
                    <Link to='/search'>
                        <button>SEARCH</button>
                    </Link>
                    <Link to='/checkIn'>
                        <button>CHECK IN</button>
                    </Link>
                </div>
            </div>
            <div className="forResponsive">
                <img src={'/imgs/menu.svg'} id="menu-icon" onClick={()=>setMenuVisible(!menuVisible)}></img>
                {menuVisible && <Sidebar setMenuBarClick={(e)=>checkMenuVisible(e)}/>}
            </div>
            <Footer/>
        </div>
    )
}

export default Homepage