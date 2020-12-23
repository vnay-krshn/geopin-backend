import React, { useState } from 'react'
import HomepageNav from '../comp/homepageNav'
import CheckinMap from '../comp/CheckinMap'
import '../css/review.css'
import Sidebar from '../comp/sidebar'


const CheckinResults = () => {
    const [menuVisible, setMenuVisible] = useState(false)

    const checkMenuVisible = (e) => {
        if (e === false) {
            setMenuVisible(false)
        }
    }

    return (
        <div className='checkinResults'>
            <div className="checkin-blur">
                <HomepageNav />
                <CheckinMap />
                <div className="forResponsive">
                    <img src={'/imgs/menu.svg'} id="menu-icon" onClick={() => setMenuVisible(!menuVisible)}></img>
                    {menuVisible && <Sidebar setMenuBarClick={(e) => checkMenuVisible(e)} />}
                </div>
            </div>
        </div>)
}

export default CheckinResults