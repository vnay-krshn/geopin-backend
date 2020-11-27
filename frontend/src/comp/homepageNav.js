import React, { useContext, useEffect } from 'react'
import { Link, Redirect } from 'react-router-dom'
import axios from 'axios'

class HomepageNav extends React.Component{

    logout(){
        localStorage.removeItem('token')
    }

    token = localStorage.getItem('token')
    state={username :''}

    userload(){
        if(this.token!==undefined){
            axios.get('http://localhost:4000/userlogin',
            {
                headers: { "token" : this.token  }
            })
            .then((response) => {
                this.username = response.data.name
                this.setState({username:response.data.name})
            }              
            ) 
        }
    }
    
    componentDidMount(){
        this.userload()
    }

    // componentDidUpdate(){
    //     this.userload()
    // }
    
    render(){
        return (
            <div>
                <nav className="homepage-nav">
                    <Link to='/'>
                        <img src={'/imgs/logo_inner_page.svg'}></img>
                    </Link>
                    <ul>
                        <img src={'/imgs/user_image_bitmap.svg'}></img>
                        <Link to='/userProfile' style={{ textDecoration: 'none' }}>
                            <li> {this.username} </li>
                        </Link>
                        <Link to='/login' style={{textDecoration:'none'}} >
                            <li onClick={this.logout}>Logout</li>
                        </Link>
                    </ul>
                </nav>
            </div>)
    }
}

export default HomepageNav

