import React, { useState } from 'react'
import HomepageNav from '../comp/homepageNav'
import Maps from '../comp/SearchMap'
import Visitors from '../comp/searchResults/visitors'
import { YearPicker, MonthPicker } from 'react-dropdown-date'
import ReactFlagsSelect from 'react-flags-select';
import 'react-flags-select/css/react-flags-select.css';
import { usersData } from '../mockData/userData'
import '../css/maps.css'
import '../css/placeInfo.css'
import '../css/searchResults/visitors.css'
import '../css/searchResults/filter.css'

const SearchResults = () => {
    const[year, setyear] = useState(null)
    const[month, setmonth] = useState(null)
    const[visibleFilter, setFilterVisible] = useState(false)
    const[userlist, setuserlist]=useState([])
    const[placename,setplacename]=useState('')

    return (
        <div className='searchResults'>
            <HomepageNav />
            <Maps temp={(e)=>setuserlist(e)} titlePlace={(e)=>setplacename(e)}/>{console.log(userlist)}
            {placename && <div className='visitor-details'>
                <div className='visitor-details-header'>
                    <h3>Recent visitors of {placename} </h3>
                    <ul>
                        <li>Filter</li>
                        <li><img onClick={() => setFilterVisible(!(visibleFilter))} src='/imgs/filter_icon.svg'></img></li>
                    </ul>
                </div>

                <div className="visitor-details-cards">
                    {userlist.map((data) => (
                        <Visitors data={data} key={data.user_id}/>
                    ))}
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