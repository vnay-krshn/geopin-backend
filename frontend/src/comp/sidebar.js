import React, { useEffect, useState } from 'react'
import '../css/sidebar.css'
import { Link } from 'react-router-dom'
import axios from 'axios'

const Sidebar = ({setMenuBarClick}) => {

    const [username, setUserName] = useState("")
    const [logo, setLogo] = useState("")
    const [showMenu, setShowMenu] = useState(false)

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
    }

    const refresh = (refreshToken) => {
        console.log("Refreshing token!");

        return new Promise((resolve, reject) => {
            axios
                .post("http://localhost:4000/user/refreshtoken", {},
                    {
                        headers: { "token": refreshToken }
                    })
                .then(data => {
                    if (data.data.success === false) {
                        alert("Login again");
                        // set message and return.
                        resolve(false);
                    } else {
                        //console.log(data.data.accessToken)
                        const token = data.data.accessToken;
                        localStorage.setItem("token", token);
                        resolve(token);
                    }
                });
        });
    };

    const requestLogin = async (token, refreshToken) => {
        console.log(token, refreshToken);
        return new Promise((resolve, reject) => {
            axios.get(
                "http://localhost:4000/user/userinfo",
                {
                    headers: { "token": token }
                }
            )
                .then(async data => {
                    if (data.data.success === false) {
                        if (data.data.message === "User not authenticated") {
                            alert("Login again");
                            // set err message to login again.
                        } else if (data.data.message === "Access token expired") {
                            const token = await refresh(refreshToken);
                            return await requestLogin(token, refreshToken);
                        }

                        resolve(false);
                    } else {
                        // protected route has been accessed, response can be used.
                        setUserName(data.data.name)
                        setLogo(data.data.profile_pic)
                        //console.log(state)
                        resolve(true);
                    }
                });
        });
    };

    const hasAccess = async (token, refreshToken) => {
        if (!refreshToken) return null;

        if (token === undefined) {
            // generate new accessToken
            token = await refresh(refreshToken);
            return token;
        }

        return token;
    };

    const userload = async () => {
        // if(this.token!==undefined){
        //     axios.get('http://localhost:4000/userlogin',
        //     {
        //         headers: { "token" : this.token  }
        //     })
        //     .then((response) => {
        //         this.username = response.data.name
        //         this.logo=response.data.profile_pic
        //         this.setState({
        //             username:response.data.name,
        //             logo:response.data.profile_pic
        //         })

        //     }              
        //     ) 
        // }
        let token = localStorage.getItem('token')
        let refreshToken = localStorage.getItem('refreshToken')

        token = await hasAccess(token, refreshToken);

        if (!token) {
            alert("login again")
        } else {
            await requestLogin(token, refreshToken);
        }
    }

    const closeMenu=()=>{
        const sideBarDOM = document.querySelector('.sidebar')
        sideBarDOM.style.display = "none"
        setMenuBarClick(false)
    }

    useEffect(() => {
        userload()
        const sideBarDom = document.querySelector('.sidebar')
        sideBarDom.style.display = "block"
    }, [])

    return (
        <div className="sidebar">
            <div className="user-details">
                <img src={logo}></img>
                <span>{username}</span>
            </div>
            <div className="view-profile routePage">
                <Link to='/userProfile' style={{ textDecoration: 'none' }}>
                    <span>View profile</span>
                </Link>
            </div>
            <div className="home-page routePage">
                <Link to='/homepage' style={{ textDecoration: 'none' }} onClick={closeMenu}>
                    <span>Home</span>
                </Link>
            </div>
            <div className="logout routePage">
                <Link to='/login' style={{ textDecoration: 'none' }}>
                    <span onClick={logout}>Logout</span>
                </Link>
            </div>
        </div>)
}

export default Sidebar