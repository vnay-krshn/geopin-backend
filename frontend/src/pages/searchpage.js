import React from 'react'
import HomepageNav from '../comp/homepageNav'
import Footer from '../comp/landingPage/footer'
import Options from '../comp/options'
import '../css/options.css'

const SearchPage=()=>{
  return(
    <div className="searchpage">
       <HomepageNav/>
       <h2>FIND YOUR DREAM DESTINATION</h2>
       <Options option={'Search'} optroute={'/searchResults'}/>
       <Footer/>
    </div>)
}

export default SearchPage