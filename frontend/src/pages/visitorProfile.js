import React from 'react'
import PlacesLogged from '../comp/placesLogged'
import ProfileHead from '../comp/profileHead'
import {placesData} from '../mockData/placesData'
import '../css/profileHead.css'
import '../css/placesLogged.css'

const VisitorProfile=()=>{
    return(
    <div className="visitor-profile">
        <ProfileHead/>
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