import React from 'react'
import Ratings from './ratings'
import '../css/ratings.css'

const PlaceInfo=({location})=>{
    return(
    <div className="placeInfo">
        <img src='/imgs/side_image.png'></img>
        <div className="information" >
            <h2>{location}</h2>
            <p>The Rockaway River flows through flat 
            plains of Denville and Boonton Township. At this 
            point elevation is 480 feet (150 m) above sea level.</p>
        </div>
         <div className="details">
            <div className="details-type">
                <label>Visitors<pre> :</pre></label>
                <label>Ratings<pre> :</pre></label>
                <label>Zip<pre>     :</pre></label>
            </div>
            <div className="details-info">
                <label id="visitor-num">476</label>
                <Ratings size={10}/>
                <label id="zip">1108</label>
            </div>
        </div> 
    </div>)
}

export default PlaceInfo