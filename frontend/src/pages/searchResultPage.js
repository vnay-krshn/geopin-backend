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
import Footer from '../comp/landingPage/footer'

var lastElement
var userID = 0
const SearchResults = () => {
    const[year, setyear] = useState("")
    const[month, setmonth] = useState("")
    const[visibleFilter, setFilterVisible] = useState(false)
    const[placename,setplacename]=useState('')
    const[ratingFilter, setRatingFilter]=useState("")
    const[countryFilter, setCountryFilter]=useState("")
    const[filteredData, setFilteredData]=useState([])
    const[userlist,setUserList]=useState([])
    const [minUserList, setMinUserList]=useState(5)

    var token = localStorage.getItem('token')

    useEffect(()=>{
        if (token !== undefined) {
            axios.get('http://localhost:4000/userlogin',
                {
                    headers: { "token": token }
                })
                .then((response) => {
                  userID=response.data.id
                  //console.log(userID)
                }
                )
        }
    },[placename])

    const flagSelect = (e) => {
        setCountryFilter(e)
    }

    const getUserList=(e)=>{
           if(!(Object.keys(e[0]).includes("titlePlace"))){
           
            //userlist=e
           
            lastElement=e.length-1
            setplacename((e[lastElement]).titlePlace)
            let listOfUsers=[...e].slice(0,lastElement)
            
            setUserList(listOfUsers)
           }else{
               setplacename("")
           }            
    }

    const fixRating=(e)=>{
       setRatingFilter(e.target.value)
       console.log(ratingFilter)
    }

    const resetFilterState=()=>{
        setmonth("")
        setyear("")
        setRatingFilter("")
        setCountryFilter("")
    }

    useEffect(()=>{
        console.log(countryFilter)
        let temp= userlist.filter((data)=>{

            const checkRatingFilter = data.rating>=ratingFilter || ratingFilter===""
            const checkCountryFilter = data.country_id===countryFilter || countryFilter===""
            let dateVisited = new Date(data.date)
            const checkMonthFilter = dateVisited.getMonth()==month || month ===""
            const checkYearFilter=dateVisited.getFullYear()==year || year ===""

            if((ratingFilter==="")&&(countryFilter==="")&&(year==="")&&(month==="")){
                return data
            }else if(checkRatingFilter && checkCountryFilter && checkYearFilter && checkMonthFilter){
                console.log(data.location,countryFilter)
                return data
            }
        })
       temp=temp.slice(0,minUserList)
        setFilteredData(temp)

    },[countryFilter,ratingFilter,userlist,year,month,minUserList])


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
                    { 
                     filteredData.map((data) => {
                        if(data.user_id!=userID){
                            return <Visitors data={data} key={data.user_id}/>
                        }
                    })
                    }
                </div>
                {minUserList<userlist.length && (<button onClick={()=>{setMinUserList((previousState)=>previousState+2)}}>More</button>)}
            </div>}
            {visibleFilter &&
                <div className="filter">
                    <div className="nationality">
                        <ReactFlagsSelect
                            placeholder="visitor's nationality"
                            searchable={true}
                            className="menu-flags"
                            onSelect={(e) => flagSelect(e)}
                        />
                    </div>
                    <div>
                        <MonthPicker
                            defaultValue={'visited month'}
                            value={month}
                            name={'month'}
                            classes={'monthClass'}
                            onChange={(month) => {
                                setmonth(month);
                            }}
                        />

                        <YearPicker
                            defaultValue={'visited year'}
                            value={year}
                            name={'year'}
                            onChange={(year) => {
                                setyear(year)
                            }}
                        />
                    </div>
                    <input type="number" placeholder="visitor's rating from 1 to 5" onChange={(e)=>{fixRating(e)}}></input>
                    <button onClick={() => setFilterVisible(!(visibleFilter))}>Done</button>
                    <button id="reset" onClick={()=>{resetFilterState()}}>Reset</button>
                </div>
            }
            {placename && <Footer/>}
        </div>)
}

export default SearchResults