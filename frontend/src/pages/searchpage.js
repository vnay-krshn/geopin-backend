import React,{useState} from 'react'
import HomepageNav from '../comp/homepageNav'
import Footer from '../comp/landingPage/footer'
import Options from '../comp/options'
import '../css/options.css'
import Sidebar from '../../src/comp/sidebar'

const SearchPage=()=>{
  const [menuVisible, setMenuVisible] = useState(false)

  const checkMenuVisible=(e)=>{
    if(e===false){
        setMenuVisible(false)
    }
 }

  return(
    <div className="searchpage">
       <HomepageNav/>
       <h2>FIND YOUR DREAM DESTINATION</h2>
       <Options option={'Search'} optroute={'/searchResults'}/>
       <div className="forResponsive">
                <img src={'/imgs/menu.svg'} id="menu-icon" onClick={()=>setMenuVisible(!menuVisible)}></img>
                {menuVisible && <Sidebar setMenuBarClick={(e)=>checkMenuVisible(e)}/>}
        </div>
       <Footer/>
    </div>)
}

export default SearchPage