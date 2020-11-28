import React, { useState, useEffect } from 'react'
import ProfileHead from '../comp/profileHead'
import ReactFlagsSelect from 'react-flags-select';
import 'react-flags-select/css/react-flags-select.css';
import Ratings from '../comp/ratings'
import PlacesLogged from '../comp/placesLogged'
import { usersData } from '../mockData/userData'
import axios from 'axios'
import '../css/userEdit.css'

class UserProfile extends React.Component {

    state = {
        id: '',
        name: '',
        email: '',
        country: '',
        phone: '',
        visibleUserEdit: false,
        flag: '',
        placesData: [],
        latestSearch: [],
        dateParseReady:false,
        navbaredit:false
    }

    token = localStorage.getItem('token')

    userLoad() {
        if (this.token !== undefined) {
            axios.get('http://localhost:4000/userlogin',
                {
                    headers: { "token": this.token }
                })
                .then((response) => {
                    this.setState({
                        id: response.data.id,
                        name: response.data.name,
                        email: response.data.email,
                        country: response.data.country,
                        phone: response.data.phone
                    })
                    this.userActitivity(this.state.id)
                    this.update = this.update.bind(this)
                }
                )
        }
    }

    dateParser() {
        this.state.latestSearch.map(items=>{
            var d = new Date(items.date);
            var day = ((d.toString()).split(" "))[1]
            var month = ((d.toString()).split(" "))[2]
            var year = ((d.toString()).split(" "))[3]
            var parsedDate = day + " " + month + " " + year
            items.date= parsedDate
        })
        this.setState({dateParseReady:true})    
    }

    latestSearch(id) {
        axios.get('http://localhost:4000/latestsearch', {
            params: {
                userID: id
            }
        })
            .then(res => {
                this.setState({ latestSearch: res.data })
                console.log(this.state.latestSearch)
                this.dateParser()
            })
    }

    userActitivity(id) {
        axios.get('http://localhost:4000/visitoracitvity', {
            params: {
                userID: id
            }
        })
            .then(res => {
                this.setState({ placesData: res.data })
                console.log(this.state.placesData)
                this.latestSearch(this.state.id)
            })
    }

    componentDidMount() {
        this.userLoad()
    }

    flagSelect = (e) => {
        this.setState({ flag: e })
    }

    componentDidUpdate() {
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
        this.setState({navbaredit:true})
        this.setState({ visibleUserEdit: !(this.state.visibleUserEdit) })
        axios.patch('http://localhost:4000/update', this.state)
            .then(res => {
                console.log(res)
            })
        this.userLoad()
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
                                <input placeholder="Search your posts"></input>
                                <button><img src='/imgs/loupe.svg'></img></button>
                            </div>
                            <div className="recent-searches">
                                <div className="title">Latest Searches</div>
                                {this.state.dateParseReady && this.state.latestSearch.map((items) => (
                                    <div className="latest-search" key={items.search_id}>
                                        <div className="latest-search-info">
                                            <label>{items.location}</label>
                                            <label>{items.date}</label>
                                        </div>
                                        <Ratings size={10} value={items.avg_rating}/>
                                    </div>
                                ))}
                            </div>
                            <div className="saved-contacts">
                                <div className="title">Saved contacts</div>
                                <div className="contact-images">
                                    {usersData.map((items, key) => (
                                        <img src={items.image} key={key}></img>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="main">
                            {this.state.placesData.map((data) => (
                                <PlacesLogged data={data} key={data.location} />
                            ))}
                        </div>
                        <label style={{ position: "absolute", right: '13em', top: '20em' }}>Places logged : {this.state.placesData.length} </label>
                    </div>
                    <button id="more">MORE</button>
                </div>
                {this.state.visibleUserEdit &&
                    <div className="useredit">
                        <div className="editprofile">
                            <div className="edit-title">Edit Profile</div>
                            <div className="profile-pic">
                                <img id="user-pic" src='/imgs/user_image_bitmap.svg'></img>
                                <img id="user-pic-edit" src="/imgs/edit_photo.svg"></img>
                            </div>
                            <form className="profile-edit-form">
                                <div className="form-group">
                                    <label>Name</label>
                                    <input type="text" value={this.state.name} name="name" onChange={(e) => this.update(e)}></input>
                                </div>
                                <div className="form-group">
                                    <label>Nationality</label>
                                    <ReactFlagsSelect
                                        defaultCountry={this.state.country}
                                        searchable={true}
                                        optionsSize={15}
                                        showOptionLabel={false}
                                        onSelect={(e) => this.flagSelect(e)}
                                        name="country"
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
                        <button id="edit-done" onClick={(e) => this.saveUpdate(e)}>DONE</button>
                    </div>
                }
            </div>)

    }
}


export default UserProfile