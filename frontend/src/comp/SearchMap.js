import React, { Component, useEffect, useState } from "react";

import PlaceInfo from './placeinfo'

import mapboxgl from 'mapbox-gl'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import 'mapbox-gl/dist/mapbox-gl.css'
import axios from 'axios'
import Sidebar from './sidebar'

var coordinates = {
    "latitude": '',
    "longitude": ''
}
var users = []
var userID = 0
var output = {
    count: '',
    rating: '',
    location: '',
    city: ''
}
const SearchMap = ({ temp }) => {

    const [showPlaceinfo, setPlaceinfo] = useState(false)
    const [menuVisible, setMenuVisible] = useState(false)

    const checkMenuVisible=(e)=>{
       if(e===false){
           setMenuVisible(false)
       }
    }

    const getCity = (coordinates) => {
        var lat = coordinates.latitude;
        var lng = coordinates.longitude;
        axios.get("https://us1.locationiq.com/v1/reverse.php?key=pk.a418ebb2be45d0efd214f1e25c8bdc65&lat=" +
            lat + "&lon=" + lng + "&format=json")
            .then(results => {
                let arr = results.data.address
                console.log(arr)
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

    const userLoad = async () => {
        let token = localStorage.getItem('token')
        if (token !== undefined) {
            await axios.get('http://localhost:4000/user/userinfo',
                {
                    headers: { "token": token }
                })
                .then((response) => {
                    userID = response.data.id
                }
                )
        }

    }

    const sendSearch = () => {
        console.log(output.city)
        let postFeed = {
            location: output.location,
            city: output.city,
            coordinates: coordinates,
            userID: userID,
            avgRating: output.rating
        }
        console.log(postFeed)
        axios.post('http://localhost:4000/searches/save', postFeed)
            .then((response) => {
                console.log(response)
            })
    }

    const listUsers = (coordinates) => {
        axios.get('http://localhost:4000/searches/userslist', {
            params: {
                coordinates: coordinates
            }
        })
            .then(res => {
                users = res.data
                users.push({ 'titlePlace': output.location })
                temp(users)
            })
    }

    const getPlaceInfo = (coordinates) => {
        axios.get('http://localhost:4000/searches/placeinfo', {
            params: {
                coordinates: coordinates
            }
        })
            .then(res => {
                output.count = res.data.count
                output.rating = res.data.rating
                setPlaceinfo(true)
            })
    }

    useEffect(() => {
        userLoad()
        const button = document.querySelector('.operation')
        button.textContent = "Search"

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
            setPlaceinfo(false)
            output.location = e.result.text
            coordinates.latitude = e.result.geometry.coordinates[1]
            coordinates.longitude = e.result.geometry.coordinates[0]
            getCity(coordinates)
            setTimeout(() => {
                getPlaceInfo(coordinates)
            }, 1000)
            listUsers(coordinates)
            setTimeout(sendSearch, 2000)
        })
        map.addControl(geocoder)
    }, [])

    return (
        <div>
            <div id="map">
                {showPlaceinfo && <PlaceInfo output={output} />}
            </div>
            <div className="divContainer">
                <button className="operation"></button>
                <div className="forResponsive">
                    <img src={'/imgs/menu.svg'} id="menu-icon" onClick={() => setMenuVisible(!menuVisible)}></img>
                    {menuVisible && <Sidebar setMenuBarClick={(e) => checkMenuVisible(e)} />}
                </div>
            </div>
        </div>
    );
}


export default SearchMap;
