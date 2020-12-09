import React, { lazy,Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './styles.css';
import './css/userEdit.css'
import './css/profileHead.css'
import './css/placesLogged.css'
import './css/options.css'
import './css/homePageNav.css'
import './css/placeInfo.css'

import 'mapbox-gl/dist/mapbox-gl.css'
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import './css/maps.css'

import Protected from './ProtectedRoutes1'
import ProtectAuth from './ProtectedRoutes2'

const Landingpage = lazy(()=>import('./pages/landingPage'))
const RegisterVal = lazy(()=>import('./pages/registerVal'))
const LoginVal = lazy(()=>import('./pages/loginVal'))
const Homepage = lazy(()=>import('./pages/homepage'))
const SearchPage = lazy(()=>import('./pages/searchpage'))
const CheckInPage = lazy(()=>import('./pages/checkInPage'))
const SearchResults = lazy(()=>import('./pages/searchResultPage'))
const CheckinResults = lazy(()=>import('./pages/checkinResultPage'))
const VisitorProfile = lazy(()=>import('./pages/visitorProfile'))
const UserProfile = lazy(()=>import('./pages/userprofile'))


function App(){

  return(
      <Router>
        <Suspense fallback={<div>Loading...</div>}>
            <Switch>
              <ProtectAuth path='/' exact component={Landingpage}/>
              <ProtectAuth path='/register' component={RegisterVal} />
              <ProtectAuth path='/login' component={LoginVal}/>
              <Protected path='/homepage' component={Homepage} />
              <Protected path='/search' component={SearchPage}  />
              <Protected path='/checkIn' component={CheckInPage} />
              <Protected path='/searchResults' component={SearchResults} />
              <Protected path='/checkinResults' component={CheckinResults} />
              <Protected path='/visitorProfile/:id' component={VisitorProfile} />
              <Protected path='/userProfile' component={UserProfile} />
            </Switch>
        </Suspense>
      </Router>
  )
} 


export default App;
