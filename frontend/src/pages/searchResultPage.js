import React, { useEffect, useState } from 'react'
import HomepageNav from '../comp/homepageNav'
import SearchMap from '../comp/SearchMap'
import Visitors from '../comp/visitors'
import { YearPicker, MonthPicker } from 'react-dropdown-date'
import ReactFlagsSelect from 'react-flags-select';
import 'react-flags-select/css/react-flags-select.css';
import axios from 'axios'
import '../css/maps.css'
import '../css/placeInfo.css'
import '../css/searchResults/visitors.css'
import '../css/searchResults/filter.css'

var userlist = []
var lastElement
var userID = 0
const SearchResults = () => {
    const[year, setyear] = useState(null)
    const[month, setmonth] = useState(null)
    const[visibleFilter, setFilterVisible] = useState(false)
    const[placename,setplacename]=useState('')

    var token = localStorage.getItem('token')

    useEffect(()=>{
        if (token !== undefined) {
            axios.get('http://localhost:4000/userlogin',
                {
                    headers: { "token": token }
                })
                .then((response) => {
                  userID=response.data.id
                  console.log(userID)
                }
                )
        }
    },[placename])

    const getUserList=(e)=>{
        userlist=e
        lastElement=e.length-1
        setplacename((userlist[lastElement]).titlePlace)
    }

    return (
        <div className='searchResults'>
            <HomepageNav />
            <SearchMap temp={(e)=>{getUserList(e)}}/>
            {placename && <div className='visitor-details'>
                <div className='visitor-details-header'>
                    <h3>Recent visitors of {placename} </h3>
                    <ul>
                        <li>Filter</li>
                        <li><img onClick={() => setFilterVisible(!(visibleFilter))} src='/imgs/filter_icon.svg'></img></li>
                    </ul>
                </div>

                <div className="visitor-details-cards">
                    {userlist.slice(0,lastElement).map((data) => {
                        if(data.user_id!=userID){
                            return <Visitors data={data} key={data.user_id}/>
                        }
                    })}
                </div>
                <button>More</button>
            </div>}
            {visibleFilter &&
                <div className="filter">
                    <div className="nationality">
                        <ReactFlagsSelect
                            placeholder="visitor's nationality"
                            searchable={true}
                        />
                    </div>
                    <div>
                        <MonthPicker
                            defaultValue={'visited month'}
                            value={month}
                            onChange={(month) => {
                                setmonth(month)
                            }}
                        />

                        <YearPicker
                            defaultValue={'visited year'}
                            value={year}
                            onChange={(year) => {
                                setyear(year)
                            }}
                        />
                    </div>
                    <input placeholder="visitor's rating"></input>
                    <button onClick={() => { setFilterVisible(!visibleFilter) }}>Done</button>
                </div>
            }
        </div>)
}

export default SearchResults