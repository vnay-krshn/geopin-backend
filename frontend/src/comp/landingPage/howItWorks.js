import React from 'react'
import Features from './features'

import {featuresData} from '../../mockData/featuresData'

import '../../css/landingPage/howItWorks.css'
import '../../css/landingPage/features.css'



const HowItWorks=()=>{
    return(
    <div className="howItWorks">
        <h1>HOW IT WORKS</h1>
        <h4>Some instructions and suggestions</h4>
        <div className="icon-container">
           {featuresData.map((item)=>(
            <Features src={item.src} title={item.title} descr={item.description} key={item.id}/>
        ))}
        </div>
    </div>)
}

export default HowItWorks