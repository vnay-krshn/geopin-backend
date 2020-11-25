import React from 'react'
import '../../css/landingPage/footer.css'

const Footer=()=>{
    return(
        <div className="connections">
            <img src='/imgs/footer_bg.png'></img>
            <div className="connect">
                <div className="copyright">
                    <div> &#169; Copyright 2016 Geopin</div>
                </div>
                <div className="networks">
                    <img src="/imgs/facebook_active.svg"></img>
                    <img src='/imgs/google-plus_active.svg'></img>
                    <img src='/imgs/twitter_active.svg'></img>
                </div>
            </div>
        </div>
    )
}

export default Footer