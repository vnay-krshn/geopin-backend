import React, { useContext, useEffect } from 'react'
import { Link, Redirect } from 'react-router-dom'
import axios from 'axios'

class HomepageNav extends React.Component {

    logout() {
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
    }

    // token = localStorage.getItem('token')
    state = { username: '', logo: '' }

    refresh = refreshToken => {
        console.log("Refreshing token!");

        return new Promise((resolve, reject) => {
            axios
                .post("http://localhost:4000/refreshtoken", {},
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

    requestLogin = async (token, refreshToken) => {
        console.log(token, refreshToken);
        return new Promise((resolve, reject) => {
            axios.get(
                    "http://localhost:4000/userlogin",
                    {
                        headers: { "token": token }
                    }
                )
                .then(async data => {
                    if (data.data.success === false) {
                        if (data.data.message === "User not authenticated") {
                            alert("Login again");
                            // set err message to login again.
                        } else if (data.data.message === "Access token expired" ) {
                            const token = await this.refresh(refreshToken);
                            return await this.requestLogin( token, refreshToken );
                        }

                        resolve(false);
                    } else {
                        // protected route has been accessed, response can be used.
                        //console.log(data.data)
                        this.username = data.data.name
                        this.logo = data.data.profile_pic
                        this.setState({
                            username: data.data.name,
                            logo: data.data.profile_pic
                        })
                        resolve(true);
                    }
                });
        });
    };


    hasAccess = async (token, refreshToken) => {
        if (!refreshToken) return null;

        if (token === undefined) {
            // generate new accessToken
            token = await this.refresh(refreshToken);
            return token;
        }

        return token;
    };

    async userload() {
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

        token = await this.hasAccess(token, refreshToken);

        if (!token) {
            alert("login again")
        } else {
            await this.requestLogin(token, refreshToken);
        }
    }

    componentDidMount() {
        this.userload()
    }

    componentDidUpdate() {
        if (this.props.props) {
            this.userload()
        }
    }

    render() {
        return (
            <div>
                <nav className="homepage-nav">
                    <Link to='/homepage'>
                        <img src={'/imgs/logo_inner_page.svg'}></img>
                    </Link>
                    <ul>
                        <img src={this.state.logo} style={{ 'background': 'white' }}></img>
                        <Link to='/userProfile' style={{ textDecoration: 'none' }}>
                            <li> {this.username} </li>
                        </Link>
                        <Link to='/login' style={{ textDecoration: 'none' }} >
                            <li onClick={this.logout}>Logout</li>
                        </Link>
                    </ul>
                </nav>
            </div>)
    }
}

export default HomepageNav

