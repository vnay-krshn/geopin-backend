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

    constructor(props){
        super(props)
        this.handleChange=this.handleChange.bind(this)
        //this.searchBarPost=this.searchBarPost.bind(this)
    }

    state = {
        id: '',
        name: '',
        email: '',
        country: '',
        countryIcon: '',
        countryID: '',
        phone: '',
        profile_pic:'',
        visibleUserEdit: false,
        placesData: [],
        latestSearch: [],
        savedContacts: [],
        savedContactsPics: [],
        dateParseReady: false,
        navbaredit: false,
        search:null
    }

    token = localStorage.getItem('token')
    baseconverted=""

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
                        countryIcon: response.data.country_icon,
                        countryID: response.data.country_id,
                        phone: response.data.phone,
                        profile_pic:response.data.profile_pic
                    })
                    this.userActitivity(this.state.id)
                    this.findSavedContacts(this.state.id)
                    this.update = this.update.bind(this)
                }
                )
        }
    }

   handleChange(e){
       var arr=e.target.files[0]
      // this.setState({profile_pic:URL.createObjectURL(arr)})       
       var reader = new FileReader();
       if (arr) {
              reader.readAsDataURL(arr);
              reader.onload = () => {
                //var Base64 = reader.result;
                //this.baseconverted=reader.result
                this.setState({profile_pic: reader.result})
                
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
        axios.get('http://localhost:4000/latestsearch', {
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
        axios.get('http://localhost:4000/visitoracitvity', {
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
            this.setState({ countryIcon: icon.src, countryID: e, country: name.textContent }, () => {
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
        axios.patch('http://localhost:4000/update', this.state)
            .then(res => {
                console.log(res)
                if(res.data.message==="updation success"){
                     
                     this.userLoad()
                }
                this.setState({ navbaredit: false })
            })
    }

    getSavedContactPics(arr) {
        arr.map(item => {
            axios.get('http://localhost:4000/visitorprofile', {
                params: {
                    userID: item.visitor_id
                }
            })
                .then(res => {
                    this.setState({ savedContactsPics: [...this.state.savedContactsPics, res.data[0].profile_pic] }, () => {
                        //console.log(this.state.savedContactsPics)
                    })
                })
        })

    }

    findSavedContacts(id) {
        axios.get('http://localhost:4000/followerpic', {
            params: {
                userID: id
            }
        })
            .then(res => {
                this.setState({ savedContacts: res.data.rows })
                this.getSavedContactPics(this.state.savedContacts)
            })
    }

    searchBarPost(e){
        let keyword = e.target.value;
        this.setState({search:keyword})
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

    componentDidMount() {
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
                                <input placeholder="Search your posts" onChange={(e)=>this.searchBarPost(e)}></input>
                                <button onClick={()=>{this.setState({search:null})}}><img src='/imgs/loupe.svg'></img></button>
                            </div>
                            <div className="recent-searches">
                                <div className="title">Latest Searches</div>
                                {this.state.dateParseReady && this.state.latestSearch.map((items) => (
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
                                        <img src={items} key={key}></img>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="main">
                            {
                                this.state.placesData.filter((data)=>{
                                    if(this.state.search===null){
                                        return data
                                    }else if(data.location === this.state.search){
                                        return data
                                    }
                                }).map((data) => (
                                <PlacesLogged data={data} key={data.location} />
                            ))
                            }
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
            </div>)

    }
}


export default UserProfile