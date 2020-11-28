import React, { useEffect, useState } from 'react'
import PlacesLogged from '../comp/placesLogged'
import ProfileHead from '../comp/profileHead'
import '../css/profileHead.css'
import '../css/placesLogged.css'
import axios from 'axios'

const VisitorProfile=()=>{
    const[visitorInfo,setvisitorinfo]=useState({})
    const[placeData,setplaceData]=useState([])

    var id=(window.location.pathname).match(/\d/g)[0]
   
    useEffect(()=>{
        
        axios.get('http://localhost:4000/visitorprofile',{
            params: {
                userID:id
            }
        })
        .then(res => {
           setvisitorinfo(res.data[0])
           console.log(visitorInfo)
           getVisitorActivity()
        })
    },[])

    const getVisitorActivity=()=>{
        axios.get('http://localhost:4000/visitoracitvity',{
            params: {
                userID:id
            }
        })
        .then(res => {
           setplaceData(res.data)
        })
    }

    return(
    <div className="visitor-profile">
        <ProfileHead props={visitorInfo} /> 
        <button id="save">Save contact</button>
        <div className="place-cards-container">
            <label id="numberLog">Places Logged : {placeData.length} </label>
            <div className="place-cards">
                {placeData.map((data)=>(
                    <PlacesLogged data={data} key={data.place_id}/>
                ))}
            </div>
            <button id="more">More</button>
        </div>
    </div>)
}

export default VisitorProfile