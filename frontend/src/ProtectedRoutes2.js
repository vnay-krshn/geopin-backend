import React from 'react'
import { Redirect } from 'react-router-dom'

class ProtectAuth extends React.Component {

    render() {
        const Component = this.props.component;
        const isAuthenticated = localStorage.getItem('token');
       
        return !isAuthenticated ? (
            <Component />
        ) : (
            <Redirect to={{ pathname: '/homepage' }} />
        );
    }
}

export default ProtectAuth ;