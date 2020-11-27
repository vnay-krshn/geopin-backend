import React, { useEffect, useState } from 'react'
import PlacesLogged from '../comp/placesLogged'
import ProfileHead from '../comp/profileHead'
import {placesData} from '../mockData/placesData'
import '../css/profileHead.css'
import '../css/placesLogged.css'
import {OptionsContext} from '../comp/optionsContext'
import { useContext } from 'react'
import axios from 'axios'

const VisitorProfile=()=>{

    const {visitorId} = useContext(OptionsContext)
    const[getUser, setUserId] = visitorId
    const[visitorInfo,setvisitorInfo]=useState({})

    useEffect(()=>{
        console.log(getUser)
        axios.get('http://localhost:4000/visitorprofile',{
            params: {
                userID:getUser
            }
        })
        .then(res => {
           setvisitorInfo(res.data[0])
        })
    },[])

    return(
    <div className="visitor-profile">
        <ProfileHead props={visitorInfo}/> 
        <button id="save">Save contact</button>
        <div className="place-cards-container">
            <label id="numberLog">Places Logged : 12</label>
            <div className="place-cards">
                {placesData.map((data,key)=>(
                    <PlacesLogged date={data.date} location={data.location} place={data.place} description={data.description} key={key}/>
                ))}
            </div>
            <button id="more">More</button>
        </div>
    </div>)
}

export default VisitorProfile