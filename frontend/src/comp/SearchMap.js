import React, { Component, useEffect, useState } from "react";

import PlaceInfo from './placeinfo'

import mapboxgl from 'mapbox-gl'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import 'mapbox-gl/dist/mapbox-gl.css'
import axios from 'axios'

var coordinates = {
    "latitude": '',
    "longitude": ''
}
var userID = 0
var output = {
    count: '',
    rating: '',
    location:'',
    city:''
}

const Maps = () => {

    const[showPlaceinfo,setPlaceinfo]=useState(false)

    const getCity = (coordinates) => {
        var lat = coordinates.latitude;
        var lng = coordinates.longitude;
        axios.get("https://us1.locationiq.com/v1/reverse.php?key=pk.a418ebb2be45d0efd214f1e25c8bdc65&lat=" +
          lat + "&lon=" + lng + "&format=json")
          .then(results => {
            let arr=[]
            arr=Object.keys(results.data.address)
            arr.map((item)=>{
                switch(item){
                    case 'city': console.log(results.data.address.city)
                                    break;
                    case 'suburb': console.log(results.data.address.suburb) 
                                    break;
                    case 'county': console.log(results.data.address.county) 
                                    break;
                    case 'town':console.log(results.data.address.town)
                                    break;
                }
                return
            })
          })
}

    const userLoad = async() => {
        let token = localStorage.getItem('token')
        if (token !== undefined) {
            await axios.get('http://localhost:4000/userlogin',
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
        let postFeed = {
            location: output.location,
            city: output.city,
            coordinates: coordinates,
            userID: userID
        }
        //console.log(postFeed)
        axios.post('http://localhost:4000/sendsearch', postFeed)
            .then((response) => {
                //console.log(response)
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
            coordinates.latitude = e.result.geometry.coordinates[1]
            coordinates.longitude = e.result.geometry.coordinates[0]
            getCity(coordinates)
            //getPlaceInfo(coordinates)
            //output.location=e.result.text         
        })
        map.addControl(geocoder)
        const mapSearch = document.querySelector('.mapboxgl-ctrl-geocoder--input')
    }, [])

    const getPlaceInfo = (coordinates) => {
        axios.get('http://localhost:4000/placeinfo', {
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

    return (
        <div>
            <div id="map">
                {showPlaceinfo && <PlaceInfo output={output} />}
            </div>
            <div className="divContainer">
                <button className="operation"></button>
            </div>
        </div>
    );
}


export default Maps;
