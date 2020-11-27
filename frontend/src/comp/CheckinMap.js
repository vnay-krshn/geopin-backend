import React, { Component, useEffect, useState } from "react";

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
//var showPlaceinfo = false
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

const Maps = () => {

  const [visibleReview, setVisibleReview] = useState(false)
  const [review, setreview] = useState('')
  const [rating, setrating] = useState(0)
  const[showPlaceinfo,setPlaceinfo]=useState(false)

  // const [location, setlocation] = useState('')
  // const [city, setcity] = useState('')

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
        if (response.data.status === 'fail') {
          alert(response.data.message)
          setVisibleReview(true)
        } else {
          firstFeedback = true
          alert("Thank you for your response")
        }
      })
  }

  useEffect(() => {
    const button = document.querySelector('.operation')
    button.textContent = 'Check in'

    // var flag = false

    // if (window.location.pathname.indexOf('checkinResults') > -1) {
    //   button.textContent = "Check in"
    //   flag = true
    // }
    // else {
    //   button.textContent = "Search"
    // }

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
      getPlaceInfo(coordinates)
      output.location = e.result.text
      getCity(coordinates)
    })

    map.addControl(geocoder)
    const mapSearch = document.querySelector('.mapboxgl-ctrl-geocoder--input')

    button.addEventListener('click', () => {
      if (mapSearch.value) {
        if ((_.isEqual(prevCoordinates, coordinates)) && (firstFeedback)) {
          if (window.confirm("Do you wish to update your feedback?")) {
            updateChoice = true
            setVisibleReview(!(visibleReview))
          }
          else {
            setVisibleReview(false)
          }
        } else {
          setrating(0)
          setreview('')
          setVisibleReview(true)
          updateChoice = false
          firstFeedback = false
        }
      }
      else {
        alert("Please enter a location")
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
          alert(response.data.message)
          setVisibleReview(true)
        } else {
          setVisibleReview(false)
          alert("Your feedback has successfully been updated")
        }
      })
  }

  const temp = () => {
    setVisibleReview(!(visibleReview))
    if (updateChoice === true) {
      updateProfile()
    } else {
      userLoad()
    }
  }

  return (
    <div>
      <div id="map">
        {showPlaceinfo && <PlaceInfo output={output} />}
      </div>
      <div className="divContainer">
        <button className="operation"></button>
      </div>
      {visibleReview &&
        <div className="review">
          <div className="review-box">
            <textarea value={review} placeholder="Add your description" onChange={(e) => { setreview(e.target.value) }}></textarea>
            <div className="review-rating">
              <label>Rate the location</label>
              <CheckinRating value={rating} size={18} selectRating={(e) => { setrating(e) }} />
            </div>
          </div>
          <button onClick={temp}>Done</button>
        </div>}
    </div>
  );
}


export default Maps;