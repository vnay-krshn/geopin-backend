import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './styles.css';
import Homepage from './pages/homepage';
import Landingpage from './pages/landingPage';
import RegisterVal from './pages/registerVal';
import LoginVal from './pages/loginVal';
import SearchPage from './pages/searchpage';
import CheckInPage from './pages/checkInPage'
import SearchResults from './pages/searchResultPage';
import CheckinResults from './pages/checkinResultPage'
import VisitorProfile from './pages/visitorProfile'
import UserProfile from './pages/userprofile'
import Protected from './ProtectedRoutes1'
import ProtectAuth from './ProtectedRoutes2'

function App(){

  return(
      <Router>
            <Switch>
              <Route path='/' exact component={Landingpage}/>
              <ProtectAuth path='/register' component={RegisterVal} />
              <ProtectAuth path='/login' component={LoginVal}/>
              <Protected path='/homepage' component={Homepage} />
              <Protected path='/search' component={SearchPage}  />
              <Protected path='/checkIn' component={CheckInPage} />
              <Protected path='/searchResults' component={SearchResults} />
              <Protected path='/checkinResults' component={CheckinResults} />
              <Protected path='/visitorProfile' component={VisitorProfile} />
              <Protected path='/userProfile' component={UserProfile} />
            </Switch>
        </Router>
  )
} 


export default App;
