import React, { useEffect, useState } from 'react'
import PlacesLogged from '../comp/placesLogged'
import ProfileHead from '../comp/profileHead'
import '../css/profileHead.css'
import '../css/placesLogged.css'
import axios from 'axios'
import Footer from '../comp/landingPage/footer'

const VisitorProfile=()=>{
    const[visitorInfo,setvisitorinfo]=useState({})
    const[placeData,setplaceData]=useState([])
    const [minUserList, setMinUserList]=useState(2)
    const [filteredData, setFilteredData] = useState([])

    var visitorId, visitor_name=""

    if((window.location.pathname).match(/\d/g).length>1){
        visitorId=(window.location.pathname).match(/\d/g).join("")
    }else{
        visitorId=(window.location.pathname).match(/\d/g)[0]
    }
   
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
        saveButton.style.border="none"
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
            visitorId:visitorId,
            visitor_name:visitor_name
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
        saveButton.style.background='#5FA7AB'
        saveButton.style.border="1px solid white" 
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

    useEffect(()=>{
        console.log(placeData)
        let newArr = placeData.slice(0,minUserList)
        console.log(newArr)
        setFilteredData(newArr)
    },[placeData,minUserList])

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
            visitor_name=res.data[0].name
           setvisitorinfo(res.data[0])
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
                {filteredData.map((data)=>(
                    <PlacesLogged data={data} key={data.place_id}/>
                ))}
            </div>
            {minUserList<placeData.length && <button id="more" onClick={()=>{setMinUserList((previousState)=>previousState+2)}}>More</button>}
        </div>
    <Footer/>
    </div>)
}

export default VisitorProfile