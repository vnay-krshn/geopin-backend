import React from 'react'
import HomepageNav from './homepageNav'
import '../css/profileContact.css'

const ProfileHead=({props})=>{
    return(
        <div className="profileHead">
            <HomepageNav props={props.navbaredit} />
            <div className="profileHead-header">
                <img id="profile" style={{'background':'white'}} src={props.profile_pic}></img>
                <div className="profileHead-name">
                    <h4> {props.name} </h4>
                    <label> {props.email} </label>
                </div>
                <div className="profileHead-nationality">
                    <img src={props.countryIcon}></img>
                    <label>{props.country}</label>
                </div>
                <div className='profileHead-contact'>
                    <label>Contact number</label>
                    <label>{props.phone}</label>
                </div>
            </div>
        </div>)
}

export default ProfileHead