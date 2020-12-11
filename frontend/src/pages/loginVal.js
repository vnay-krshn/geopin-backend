import React, { useState, useContext } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Link, Redirect, Route } from 'react-router-dom'
import axios from 'axios'

const initialValues = {
    email: '',
    password: '',
}

const validationSchema = Yup.object({
    email: Yup.string()
        .email('Invalid email format')
        .required('Required'),
    password: Yup.string()
        .min(6, 'Password has to be longer than 6 characters')
        .required('Required'),
})

const LoginVal = () => {

    const [accountcreated, setaccount] = useState(false)
    const [displayStatus, setDisplayStatus] = useState(false)
    const [statusMessage, setStatusMessage] = useState("")

    const submit = e => {
        let user = { email: e.email, password: e.password }
        axios.post('http://localhost:4000/login', user)
            .then(res => {
                if ((res.data.message === 'user does not exist') || (res.data.message === 'Incorrect Password !')) {
                    //alert(res.data.message)
                    setDisplayStatus(true)
                    setStatusMessage(res.data.message)
                    setTimeout(() => setDisplayStatus(false), 3000)
                    setaccount(false)
                    return <Redirect to='/login' />
                }
                else {
                    console.log(res.data)
                    localStorage.setItem('token', res.data.token)
                    localStorage.setItem('refreshToken', res.data.refreshToken)
                    setaccount(true)
                }
            }
            )
    }

    if (accountcreated === true) {
        return <Redirect to='/homepage' />
    }

    return (
        <div className="login">
            <Link to='/'>
                <img src='/imgs/logo.svg'></img>
            </Link>
            <div className="login-box">
                <h3>LOGIN</h3>
                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={(e) => submit(e)}>
                    <Form className="login-form">
                        <div className="form-control">
                            <Field
                                placeholder="Email"
                                type="email"
                                id="email"
                                name="email" />
                            <div style={{ color: 'rgb(241, 151, 151)' }}>
                                <ErrorMessage name='email' />
                            </div>
                        </div>
                        <div className="form-control">
                            <Field
                                placeholder="Password"
                                type="password"
                                id="password"
                                name="password" />
                            <div style={{ color: 'rgb(241, 151, 151)' }}>
                                <ErrorMessage name='password' />
                            </div>
                        </div>
                        <button type="submit">LOGIN</button>
                        <label>
                            Don't have an account?
                            <Link to='/register'>
                                Register Now
                            </Link>
                        </label>
                        <label style={{margin:'0em 0em 0em 6em',fontSize:'0.9rem',width:'12vw'}}>
                            <Link to='/forgotpass' style={{color:'#acfff4'}}>
                                Forgotten password?
                            </Link>
                        </label>
                    </Form>
                </Formik>
                {displayStatus && (<span id="successMessage">{statusMessage}</span>)}
            </div>
        </div>
    )
}

export default LoginVal