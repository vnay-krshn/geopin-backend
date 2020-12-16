import React, { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Link, Redirect, Route } from 'react-router-dom'
import axios from 'axios'
import Footer from '../comp/landingPage/footer'

const initialValues = {
    email: ''
}

const validationSchema = Yup.object({
    email: Yup.string()
        .email('Invalid email format')
        .required('Required')
})

const ForgotPassword = () => {

    const [displayStatus, setDisplayStatus] = useState(false)
    const [statusMessage, setStatusMessage] = useState("")

    const submit = e => {
        let user = { email: e.email }
        axios.post('http://localhost:4000/forgot', user)
            .then(res => {
                if (res.data.message === "User does not exist" || res.data.message === "Password reset link has been sent to your mail") {
                    setDisplayStatus(true)
                    setStatusMessage(res.data.message)
                    setTimeout(() => setDisplayStatus(false), 3000)
                }
            })
    }

    return (
        <div className="forgotPasswd">
            <Link to='/'>
                <img id="logoImage" src='/imgs/logo.svg'></img>
            </Link>
            <div className="forgotPasswd-box">
                <h3>RESET PASSWORD</h3>
                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={(e) => submit(e)}>
                    <Form className="forgotPasswd-form">
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
                        <button type="submit">RESET</button>
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
            <Footer/>
        </div>
    )
}

export default ForgotPassword