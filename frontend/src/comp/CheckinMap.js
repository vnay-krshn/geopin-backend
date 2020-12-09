import React, { useEffect, useState } from "react";

import CheckinRating from './CheckinRating'
import PlaceInfo from './placeinfo'

import mapboxgl from 'mapbox-gl'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import 'mapbox-gl/dist/mapbox-gl.css'
import axios from 'axios'
import '../css/review.css'
import _ from 'lodash'

var coordinates = {
  "latitude": '',
  "longitude": ''
}
var userID = 0
var updateChoice = false
var firstFeedback = false
var prevCoordinates = {
  "latitude": '',
  "longitude": ''
}
var output = {
  count: '',
  rating: '',
  location: '',
  city: ''
}

const CheckinMap = () => {

  const [visibleReview, setVisibleReview] = useState(false)
  const [review, setreview] = useState('')
  const [rating, setrating] = useState(0)
  const [showPlaceinfo, setPlaceinfo] = useState(false)
  const [message, setMessage] = useState("")
  const [showMessage, setDisplayMessage] = useState(false)
  const [showUpdateMessage, setUpdateMessage] = useState(false)

  const getCity = (coordinates) => {
    var lat = coordinates.latitude;
    var lng = coordinates.longitude;
    axios.get("https://us1.locationiq.com/v1/reverse.php?key=pk.a418ebb2be45d0efd214f1e25c8bdc65&lat=" +
      lat + "&lon=" + lng + "&format=json")
      .then(results => {
        let arr = results.data.address
        if (arr.hasOwnProperty("city")) {
          output.city = arr.city
          console.log(output.city)
        }
        else if (arr.hasOwnProperty("suburb")) {
          output.city = arr.suburb
          console.log(output.city)
        }
        else if (arr.hasOwnProperty("county")) {
          output.city = arr.county
          console.log(output.city)
        }
        else {
          output.city = arr.town
          console.log(output.city)
        }
      })
  }

  const msgDispControlFun=(message)=>{
    setDisplayMessage(true)
    setMessage(message)
    setTimeout(() => {
      setDisplayMessage(false)
    }, 1500)
  }

  const userLoad = () => {
    let token = localStorage.getItem('token')
    if (token !== undefined) {
      axios.get('http://localhost:4000/userlogin',
        {
          headers: { "token": token }
        })
        .then((response) => {
          userID = response.data.id
          if ((updateChoice === false) && (firstFeedback == false)) {
            postReview()
          }
        }
        )
    }

  }

  const postReview = () => {

    let postFeed = {
      location: output.location,
      city: output.city,
      coordinates: coordinates,
      review: review,
      rating: rating,
      userID: userID
    }
    console.log(postFeed)
    axios.post('http://localhost:4000/checkin', postFeed)
      .then((response) => {
        console.log(response)
        if (response.data.status === 'fail'|| response.data.error) {
          //alert(response.data.message)
          // setDisplayMessage(true)
          // setMessage(response.data.message)
          // setTimeout(() => {
          //   setDisplayMessage(false)
          // }, 3000)
          msgDispControlFun(response.data.message)
          setVisibleReview(true)
        } else {
          firstFeedback = true
          // setDisplayMessage(true)
          // setMessage("Thank you for your response")
          // setTimeout(() => {
          //   setDisplayMessage(false)
          // }, 3000)
          msgDispControlFun("Thank you for your response")
        }
      })
  }

  const getPlaceInfo = (coordinates) => {
    axios.get('http://localhost:4000/placeinfo', {
      params: {
        coordinates: coordinates
      }
    })
      .then(res => {
        console.log(res.data)
        output.count = res.data.count
        output.rating = res.data.rating
        setPlaceinfo(true)
      })
  }

  useEffect(() => {
    const button = document.querySelector('.operation')
    button.textContent = 'Check in'

    var divContainer = document.querySelector('.divContainer')
    var mapContainer = document.querySelector('#map')
    mapContainer.appendChild(divContainer)

    mapboxgl.accessToken = 'pk.eyJ1IjoidmluYXlrcmlzaG5hbiIsImEiOiJja2hzcDc5OGQwMndxMnpvM2RwdDVhNmFhIn0.aVpBgvw8pQDdNn0eoQjXtQ';
    var map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      zoom: 6,
      center: [78.47, 22.19]
    });

    const nav = new mapboxgl.NavigationControl();
    map.addControl(nav);

    var geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl
    })

    geocoder.on('result', (e) => {
      //console.log(e.result)
      setPlaceinfo(false)
      coordinates.latitude = e.result.geometry.coordinates[1]
      coordinates.longitude = e.result.geometry.coordinates[0]
      setTimeout(() => {
        getPlaceInfo(coordinates)
      }, 1000)
      output.location = e.result.text
      getCity(coordinates)
    })

    map.addControl(geocoder)
    const mapSearch = document.querySelector('.mapboxgl-ctrl-geocoder--input')

    button.addEventListener('click', () => {
      if (mapSearch.value) {
        if ((_.isEqual(prevCoordinates, coordinates)) && (firstFeedback)) {
          setUpdateMessage(true)
          updateChoice=true
          // if (updateChoice) {
          //   setVisibleReview(!(visibleReview))
          // }
          // else {
          //   setUpdateMessage(false)
          //   setVisibleReview(false)
          // }
        } else {
          setrating(0)
          setreview('')
          setVisibleReview(true)          
          updateChoice = false
          firstFeedback = false
        }
      }
      else {
        // setDisplayMessage(true)
        // setMessage("Please enter a location")
        // setTimeout(() => {
        //   setDisplayMessage(false)
        // }, 3000)
        msgDispControlFun("Please enter a location")
      }
      prevCoordinates.latitude = coordinates.latitude
      prevCoordinates.longitude = coordinates.longitude

    })

  }, [])

  useEffect(() => {
    const checkIn = document.querySelector('#map, .placeInfo')
    const button = document.querySelector('.operation')
    if (visibleReview) {
      checkIn.style.filter = 'blur(2px)'
      button.disabled = true

    } else {
      checkIn.style.filter = 'None'
      button.disabled = false
    }
  }, [visibleReview])

  const updateProfile = () => {
    let updation = {
      review: review,
      rating: rating,
      userID: userID,
      coordinates: coordinates
    }
    console.log(updation)
    axios.patch('http://localhost:4000/updatefeed', updation)
      .then((response) => {
        console.log(response)
        if (response.data.status === 'fail') {
          //alert(response.data.message)
          // setDisplayMessage(true)
          // setMessage(response.data.message)
          // setTimeout(() => {
          //   setDisplayMessage(false)
          // }, 3000)
          msgDispControlFun(response.data.message)
          setVisibleReview(true)
        } else {
          setVisibleReview(false)  
          // setDisplayMessage(true)
          // setMessage("Your feedback has successfully been updated")
          // setTimeout(() => {
          //   setDisplayMessage(false)
          // }, 3000)
          msgDispControlFun("Your feedback has successfully been updated")
        }
      })
  }

  const doneReview = () => {
    setVisibleReview(!(visibleReview))
    if (updateChoice === true) {
      updateProfile()
    } else {
      userLoad()
    }
  }

  const removeUpdateChoice=()=>{
    setVisibleReview(false)
    setUpdateMessage(false)
  }

  const updateChoiceFunction = ()=>{
    //updateChoice = true
    setVisibleReview(!(visibleReview))
    setUpdateMessage(false)
  }

  return (
    <div>
      <div id="map">
        {showPlaceinfo && <PlaceInfo output={output} />}
      </div>
      <div className="divContainer">
        <button className="operation"></button>
      </div>
      {showMessage && <span id="message">{message}</span>}
      {showUpdateMessage && <div id="updateConfirm">
        <span>Do you wish to update your feedback?</span>
        <div id="confirmChoice">
          <button onClick={removeUpdateChoice}>Cancel</button>
          <button type="submit" onClick={updateChoiceFunction}>OK</button>
        </div>
      </div>}
      {visibleReview &&
        <div className="review">
          <div className="review-box">
            <textarea value={review} placeholder="Add your description" onChange={(e) => setreview(e.target.value)}></textarea>
            <div className="review-rating">
              <label>Rate the location</label>
              <CheckinRating value={rating} size={18} selectRating={(e) => { setrating(e) }} />
            </div>
          </div>
          <button onClick={doneReview}>Done</button>
        </div>}
    </div>
  );
}


export default CheckinMap;