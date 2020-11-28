import React, { useEffect, useState } from 'react'
import PlacesLogged from '../comp/placesLogged'
import ProfileHead from '../comp/profileHead'
import '../css/profileHead.css'
import '../css/placesLogged.css'
import axios from 'axios'

const VisitorProfile=()=>{
    const[visitorInfo,setvisitorinfo]=useState({})
    const[placeData,setplaceData]=useState([])

    var visitorId=(window.location.pathname).match(/\d/g)[0]
    var token = localStorage.getItem('token')
    var userID = ''
   
    useEffect(()=>{
        axios.get('http://localhost:4000/visitorprofile',{
            params: {
                userID:visitorId
            }
        })
        .then(res => {
           setvisitorinfo(res.data[0])
           console.log(visitorInfo)
           getVisitorActivity()
           
        })
    },[])

    const onLoadUser=()=>{
        if (token !== undefined) {
            axios.get('http://localhost:4000/userlogin',
                {
                    headers: { "token": token }
                })
                .then((response) => {
                  userID=response.data.id
                }
                )
        }
    }

    const checkFollower=()=>{
        axios.get('http://localhost:4000/visitoracitvity',{
            params: {
                userID:userID,
                visitorId:visitorId
            }
        })
        .then(res => {
           console.log(res)
        })
    }

    const getVisitorActivity=()=>{
        axios.get('http://localhost:4000/visitoracitvity',{
            params: {
                userID:visitorId
            }
        })
        .then(res => {
           setplaceData(res.data)
           checkFollower()
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