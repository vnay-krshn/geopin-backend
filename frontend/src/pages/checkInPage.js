import React,{useState} from 'react'
import HomepageNav from '../comp/homepageNav'
import Footer from '../comp/landingPage/footer'
import Options from '../comp/options'
import Sidebar from '../../src/comp/sidebar'

const CheckInPage = () => {

    const [menuVisible, setMenuVisible] = useState(false)

    const checkMenuVisible = (e) => {
        if (e === false) {
            setMenuVisible(false)
        }
    }

    return (
        <div className="checkInPage">
            <HomepageNav />
            <h2>CHECK INTO YOUR DREAM LOCATION</h2>
            <Options option={'Check in'} optroute={'/checkinResults'} />
            <div className="forResponsive">
                <img src={'/imgs/menu.svg'} id="menu-icon" onClick={() => setMenuVisible(!menuVisible)}></img>
                {menuVisible && <Sidebar setMenuBarClick={(e) => checkMenuVisible(e)} />}
            </div>
            <Footer />
        </div>)
}

export default CheckInPage