import React, { useEffect, useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Link, Redirect, Route, useHistory } from 'react-router-dom'
import axios from 'axios'

const initialValues = {
    password: '',
    re_password: ''
}

const validationSchema = Yup.object({
    password: Yup.string()
        .min(6, 'Password has to be longer than 6 characters')
        .required('Required'),
    re_password: Yup.string()
        .min(6, 'Password has to be longer than 6 characters')
        .required('Required')
        .when("password", {
            is: val => (val && val.length > 0 ? true : false),
            then: Yup.string()
                .oneOf(
                    [Yup.ref("password")],
                    "Both password need to be the same")
        })
})

const ResetPassword = () => {

    const [displayStatus, setDisplayStatus] = useState(false)
    const [statusMessage, setStatusMessage] = useState("")
    const history = useHistory()
    let urlToken = (window.location.pathname).slice(7, (window.location.pathname.length))

    const routeBack = (message) => {
        setDisplayStatus(true)
        setStatusMessage(message)
        setTimeout(() => setDisplayStatus(false), 3000)
        setTimeout(()=>{
            history.push('/login')
        },6000)        
    }

    const checkAuth = () => {
        axios.get(`http://localhost:4000/password/reset/${urlToken}`)
            .then(res => {
                console.log(res)
                if (res.data.message === "session expired") {
                    routeBack(res.data.message)
                }
            })
    }

    const submit = e => {
        let user = { password: e.password }
        axios.post(`http://localhost:4000/password/reset/${urlToken}`, user)
            .then(res => {
                console.log(res)
                if (res.data.message === "session expired" || res.data.message === "Success! Your password has been changed") {
                    routeBack(res.data.message)
                }
            })
    }

    useEffect(() => {
        checkAuth()
    }, [])

    return (
        <div className="resetPasswd">
            <Link to='/'>
                <img id="logoImage" src='/imgs/logo.svg'></img>
            </Link>
            <div className="resetPasswd-box">
                <h3>RESET PASSWORD</h3>
                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={(e) => submit(e)}>
                    <Form className="resetPasswd-form">
                        <Field
                            placeholder="Password"
                            type="password"
                            id="password"
                            name="password" />
                        <div style={{ color: 'rgb(241, 151, 151)' }} className="error">
                            <ErrorMessage name='password' />
                        </div>
                        <Field
                            placeholder="Confirm Password"
                            type="password"
                            id="re_password"
                            name="re_password" />
                        <div style={{ color: 'rgb(241, 151, 151)' }} className="error">
                            <ErrorMessage name='re_password' />
                        </div>
                        <button type="submit">UPDATE PASSWORD</button>
                    </Form>
                </Formik>
                {displayStatus && (
                    <div id="successMessage" style={{'textAlign':"center"}}>
                        <span>
                            {statusMessage}
                        </span>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ResetPassword