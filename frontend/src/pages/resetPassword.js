import React, { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Link, Redirect, Route } from 'react-router-dom'

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

    const submit = e => {
        let user = { password: e.password }
    }

    return (
        <div className="login">
            <Link to='/'>
                <img src='/imgs/logo.svg'></img>
            </Link>
            <div className="login-box">
                <h3>RESET PASSWORD</h3>
                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={(e) => submit(e)}>
                    <Form className="login-form">
                        <Field
                            placeholder="Password"
                            type="password"
                            id="password"
                            name="password" />
                        <div style={{ color: 'rgb(241, 151, 151)' }}>
                            <ErrorMessage name='password' />
                        </div>
                        <Field
                            placeholder="Confirm Password"
                            type="password"
                            id="re_password"
                            name="re_password" />
                        <div style={{ color: 'rgb(241, 151, 151)' }}>
                            <ErrorMessage name='re_password' />
                        </div>
                        <button type="submit">UPDATE PASSWORD</button>
                    </Form>
                </Formik>
                {displayStatus && (<span id="successMessage">{statusMessage}</span>)}
            </div>
        </div>
    )
}

export default ResetPassword