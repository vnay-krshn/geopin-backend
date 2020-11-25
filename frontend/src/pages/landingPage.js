import React, { useEffect,useState } from 'react'
import {animateScroll as scroll} from 'react-scroll'
import {Link} from 'react-router-dom'
import Contact from '../comp/landingPage/contact';
import HowItWorks from '../comp/landingPage/howItWorks';
import axios from 'axios'

const Landingpage=()=>{

  const toggleMid=()=>{
        scroll.scrollTo(550)
    }
  
  const toggleBttm=()=>{
      scroll.scrollToBottom()
  }

  const[loggedin, setlogin]=useState('/register')

  const pagelink=()=>{
    if(localStorage.token===undefined){
      setlogin('/register')
    }
    else{
      setlogin('/login')
    }
  }

    return(
        <div className="landingpage">
            <div className="landingpage-main">
                <nav className="landing-nav">
                    <ul>
                        <li onClick={toggleMid}>How it works</li>
                        <li onClick={toggleBttm}>Contact</li>
                        <Link to={loggedin} onClick={pagelink}>
                             <img id="login-button" src='/imgs/login_link.png'></img>
                        </Link>
                    </ul>
                </nav>
                <img id='logo' src='/imgs/logo_landing_page_banner.png'></img>
                <div className="tagline">
                    <h1>KNOW YOUR DESTINATION AND PIN YOUR ROUTES</h1>
                    <button>GET STARTED</button>
                </div> 
            </div>
          <HowItWorks/>
          <Contact/>
        </div>
    )
}

export default Landingpage