import React, { useState, useEffect } from 'react'
import ProfileHead from '../comp/profileHead'
import ReactFlagsSelect from 'react-flags-select';
import 'react-flags-select/css/react-flags-select.css';
import Ratings from '../comp/ratings'
import PlacesLogged from '../comp/placesLogged'
import { usersData } from '../mockData/userData'
import Footer from '../comp/landingPage/footer'
import axios from 'axios'
import '../css/userEdit.css'

class UserProfile extends React.Component {

    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this)
        this.searchBarPost = this.searchBarPost.bind(this)
    }

    state = {
        id: '',
        name: '',
        email: '',
        country: '',
        country_icon: '',
        countryID: '',
        phone: '',
        profile_pic: '',
        visibleUserEdit: false,
        placesData: [],
        latestSearch: [],
        savedContacts: [],
        savedContactsPics: [],
        dateParseReady: false,
        navbaredit: false,
        search: null,
        minUserList: [],
        status: true,
        checkEmptyMessage: false,
        minUserList: 2
    }

    token = localStorage.getItem('token')
    baseconverted = ""

    userLoad() {
        if (this.token !== undefined) {
            axios.get('http://localhost:4000/user/userinfo',
                {
                    headers: { "token": this.token }
                })
                .then((response) => {
                    this.setState({
                        id: response.data.id,
                        name: response.data.name,
                        email: response.data.email,
                        country: response.data.country,
                        country_icon: response.data.country_icon,
                        countryID: response.data.country_id,
                        phone: response.data.phone,
                        profile_pic: response.data.profile_pic
                    })
                    if (this.state.status) {
                        this.userActitivity(this.state.id)
                        this.findSavedContacts(this.state.id)
                    }
                    this.update = this.update.bind(this)
                }
                )
        }
    }

    handleChange(e) {
        var arr = e.target.files[0]
        // this.setState({profile_pic:URL.createObjectURL(arr)})       
        var reader = new FileReader();
        if (arr) {
            reader.readAsDataURL(arr);
            reader.onload = () => {
                //var Base64 = reader.result;
                //this.baseconverted=reader.result
                this.setState({ profile_pic: reader.result })

            };
            reader.onerror = (error) => {
                console.log("error: ", error);
            };
        }

    }

    dateParser() {
        this.state.latestSearch.map(items => {
            var d = new Date(items.date);
            var day = ((d.toString()).split(" "))[1]
            var month = ((d.toString()).split(" "))[2]
            var year = ((d.toString()).split(" "))[3]
            var parsedDate = day + " " + month + " " + year
            items.date = parsedDate
        })
        this.setState({ dateParseReady: true })
    }

    latestSearch(id) {
        axios.get('http://localhost:4000/userprofile/recentsearch', {
            params: {
                userID: id
            }
        })
            .then(res => {
                this.setState({ latestSearch: res.data })
                this.dateParser()
            })
    }

    userActitivity(id) {
        axios.get('http://localhost:4000/visitor/acitvity', {
            params: {
                userID: id
            }
        })
            .then(res => {
                this.setState({ placesData: res.data })
                this.latestSearch(this.state.id)
            })
    }

    flagSelect(e) {
        const name = document.querySelector('.flag-select__option__label')
        const icon = document.querySelector('.flag-select__option__icon')
        setTimeout(() => {
            this.setState({ country_icon: icon.src, countryID: e, country: name.textContent }, () => {
                console.log(this.state)
            })
        }, 1)

    }

    update(e) {
        //console.log(e.target)
        switch (e.target.name) {
            case 'name': this.setState({ name: e.target.value });
                break;
            case 'email': this.setState({ email: e.target.value });
                break;
            case 'phone': this.setState({ phone: e.target.value });
                break;
        }
    }

    saveUpdate() {
        this.setState({ navbaredit: true })
        this.setState({ visibleUserEdit: !(this.state.visibleUserEdit) })
        console.log(this.state)
        axios.patch('http://localhost:4000/userprofile/update', this.state)
            .then(res => {
                console.log(res)
                if (res.data.message === "updation success") {

                    this.userLoad()
                }
                this.setState({ navbaredit: false })
            })
    }

    getSavedContactPics(arr) {
        arr.map(item => {
            axios.get('http://localhost:4000/visitor/profile', {
                params: {
                    userID: item.visitor_id
                }
            })
                .then(res => {
                    this.setState({
                        savedContactsPics: [...this.state.savedContactsPics, {
                            profile_pic: res.data[0].profile_pic,
                            visitor_name: res.data[0].name
                        }]
                    }, () => {
                        console.log(this.state.savedContactsPics)
                    })
                })
        })

    }

    findSavedContacts(id) {
        axios.get('http://localhost:4000/followers/info', {
            params: {
                userID: id
            }
        })
            .then(res => {
                this.setState({ savedContacts: res.data.rows })
                this.getSavedContactPics(this.state.savedContacts)
                this.state.status = false
            })
    }

    searchBarPost(e) {
        let keyword = e.target.value;
        this.setState({ search: keyword })
    }

    displayEmpty() {
        const emptyDashBoard = document.querySelector('#placesLoggedCount')
        const extendMoreButton = document.querySelector('#more')
        if (this.state.placesData.length === 0) {
            emptyDashBoard.style.display = "none"
            extendMoreButton.style.display = "none"
            this.state.checkEmptyMessage = true
        }
        else if (this.state.minUserList > this.state.placesData.length) {
            extendMoreButton.style.display = "none"
        }
        else {
            emptyDashBoard.style.display = "block"
            extendMoreButton.style.display = "block"
            this.state.checkEmptyMessage = false
        }
    }

    updateLogList() {
        this.setState({ minUserList: this.state.minUserList + 2 })
        setTimeout(console.log(this.state.minUserList), 1000)
    }

    componentDidUpdate() {
        this.displayEmpty()
        const profile = document.querySelector('.profile-blur')
        const editButton = document.querySelector('.edit')
        if (this.state.visibleUserEdit === true) {
            profile.style.filter = 'blur(3px)'
            editButton.disabled = true
        }
        else {
            profile.style.filter = 'none'
            editButton.disabled = false
        }

    }

    componentDidMount() {
        this.userLoad()
        this.displayEmpty()
    }

    style = {
        'position': 'relative',
        'right': '15em',
        'top': '10em'
    }

    render() {
        return (
            <div className="userprofile">
                <div className="profile-blur">
                    <ProfileHead props={this.state} />
                    <button className="edit" onClick={() => this.setState({ visibleUserEdit: !(this.state.visibleUserEdit) })}>Edit</button>
                    <div className="userprofile-cards">
                        <div className="sidebar">
                            <div className="search-post">
                                <input placeholder="Search your posts" onChange={(e) => this.searchBarPost(e)}></input>
                                <button onClick={() => { this.setState({ search: null }) }}><img src='/imgs/loupe.svg'></img></button>
                            </div>
                            <div className="recent-searches">
                                <div className="title">Latest Searches</div>
                                {this.state.dateParseReady && this.state.latestSearch.slice(0, 3).map((items) => (
                                    <div className="latest-search" key={items.search_id}>
                                        <div className="latest-search-info">
                                            <label>{items.location}</label>
                                            <label>{items.date}</label>
                                        </div>
                                        <Ratings size={10} value={items.avg_rating} />
                                    </div>
                                ))}
                            </div>
                            <div className="saved-contacts">
                                <div className="title">Saved contacts</div>
                                <div className="contact-images">
                                    {this.state.savedContactsPics.map((items, key) => (
                                        <div className="displayContacts">
                                            <img src={items.profile_pic} key={key} id="followerImage"></img>
                                            <span id="followerName">{items.visitor_name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="main">
                            {
                                this.state.placesData.filter((data) => {
                                    if (this.state.search === null) {
                                        return data
                                    } else if (data.location.toLowerCase().includes(this.state.search.toLowerCase())) {
                                        return data
                                    }
                                }).slice(0, this.state.minUserList).map((data) => (
                                    <PlacesLogged data={data} key={data.location} />
                                ))
                            }
                        </div>
                        {this.state.checkEmptyMessage && <label style={this.style}>You haven't checked in to any places yet.</label>}
                        <label id="placesLoggedCount" style={{ position: "absolute", right: '6.5em', top: '20em' }}>Places logged : {this.state.placesData.length} </label>
                    </div>
                    <button id="more" onClick={() => { this.updateLogList() }}>MORE</button>
                </div>
                {this.state.visibleUserEdit &&
                    <div className="useredit">
                        <div className="editprofile">
                            <div className="edit-title">Edit Profile</div>
                            <div className="profile-pic">
                                <img id="user-pic" src={this.state.profile_pic}></img>
                                <label htmlFor="uploadButton">
                                    <img id="user-pic-edit" src="/imgs/edit_photo.svg"></img>
                                </label>
                                <input type="file" id="uploadButton" style={{ display: "none" }} onChange={this.handleChange}></input>
                            </div>
                            <form className="profile-edit-form">
                                <div className="form-group">
                                    <label>Name</label>
                                    <input type="text" value={this.state.name} name="name" onChange={(e) => this.update(e)}></input>
                                </div>
                                <div className="form-group">
                                    <label>Nationality</label>
                                    <ReactFlagsSelect
                                        defaultCountry={this.state.countryID}
                                        searchable={true}
                                        optionsSize={15}
                                        onSelect={(e) => this.flagSelect(e)}
                                        className="menu-flags"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Phone number</label>
                                    <input value={this.state.phone} name="phone" onChange={(e) => this.update(e)}></input>
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input type="email" value={this.state.email} name="email" onChange={(e) => this.update(e)}></input>
                                </div>
                            </form>
                        </div>
                        <button id="edit-done"
                            onClick={(e) => this.saveUpdate(e)}
                        >DONE</button>
                    </div>
                }
                <Footer/>
            </div>)

    }
}


export default UserProfile