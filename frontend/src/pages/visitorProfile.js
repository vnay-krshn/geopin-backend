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
    var isfollower=false
   
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

    const removesaveButton=()=>{
        const saveButton = document.querySelector('#save')
        saveButton.textContent="Save contact"
        saveButton.style.background='#00d3b8' 
        deleteFollower()
    }

    const deleteFollower=()=>{
        axios.delete('http://localhost:4000/deletefollower',{
            params: {
                userID:userID,
                visitorId:visitorId
            }
        })
        .then(res => {
          console.log(res)
          isfollower=false
        })
    }

    const saveFollower=()=>{
        let postFeed={
            userID:userID,
            visitorId:visitorId
        }
        axios.post('http://localhost:4000/savefollower',postFeed)
            .then(res=>{
                console.log(res)
                isfollower=true
            })
    }

    const enableSaveButton=()=>{
        const saveButton = document.querySelector('#save')
        saveButton.textContent="Saved"
        saveButton.style.background='red' 
        saveFollower()
    }

    const checkFollower=()=>{
        axios.get('http://localhost:4000/checkfollower',{
            params: {
                userID:userID,
                visitorId:visitorId
            }
        })
        .then(res => {
           isfollower=res.data
           if(isfollower){
               enableSaveButton()
           }
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

    useEffect(()=>{
        onLoadUser()
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
        const saveButton = document.querySelector('#save')
        saveButton.addEventListener('click',()=>{
                if(isfollower){
                    removesaveButton()
                }
                else{
                    enableSaveButton()
                }
        })
    },[])


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