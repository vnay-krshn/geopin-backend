import React, { useEffect, useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Link, useHistory } from 'react-router-dom'
import ReactFlagsSelect from '../comp/ReactflagSelect/';
import 'react-flags-select/css/react-flags-select.css';
import axios from 'axios'
import Footer from '../comp/landingPage/footer'


const initialValues = {
    username: '',
    email: '',
    phone: '',
    password: '',
    re_password: '',
}

const phoneRegExp = /(^$)|(^\d{10}$)/

const validationSchema = Yup.object({
    username: Yup.string().required('Required'),
    email: Yup.string()
        .email('Invalid email format')
        .required('Required'),
    phone: Yup.string()
        .matches(phoneRegExp, 'Phone number is not valid')
        .required('Required'),
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

const RegisterVal = () => {
    const history = useHistory();
    //let error = { message: '' }
    let country, countryIcon, countryID
    const [displayStatus, setDisplayStatus] = useState(false)
    const [statusMessage, setStatusMessage]= useState("")

    const goToLogin=()=>{
        setDisplayStatus(false)
        history.push('/login')
    }

    const submit = e => {
        let user = {
            username: e.username,
            email: e.email,
            password: e.password,
            phone: e.phone,
            country: country,
            countryIcon: countryIcon,
            countryID: countryID
        }
        
        axios.post('http://localhost:4000/register', user)
            .then(res => {
                if (res.data.message === 'email already exists') {
                    // error.message = res.data.message
                    // alert(error.message)
                    setDisplayStatus(true)
                    setStatusMessage(res.data.message)
                    setTimeout(()=>setDisplayStatus(false),3000)
                   
                }
                else if(res.data.token){
                    setDisplayStatus(true)
                    setStatusMessage("Registration was successful!")
                    setTimeout(goToLogin,1000)
                }
            }
            )
    }


    const flagSelect = (e) => {
        countryID = e.countryCode
        country= e.country
        countryIcon=e.country_icon    
    }


    return (
        <div className="register">
            <Link to='/'>
                <img id="logoImage" src='/imgs/logo.svg'></img>
            </Link>
            <div className="register-box">
                <h3>REGISTER</h3>
                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={(e) => submit(e)}>
                    <Form className="register-form">
                        <Field
                            placeholder="Name"
                            type="text"
                            id="username"
                            name="username" />
                        <div className="error">
                            <ErrorMessage name='username' />
                        </div>
                        <Field
                            placeholder="Email"
                            type="email"
                            id="email"
                            name="email" />
                        <div className="error">
                            <ErrorMessage name='email' />
                        </div>

                        <div className="contact" >
                            <div className="dropdownErr">
                                <ReactFlagsSelect
                                    className="menu-flags"
                                    placeholder="Country"
                                    searchable={true}
                                    optionsSize={2}
                                    onSelect={(e) => flagSelect(e)}
                                />
                            </div>
                            <div className="phone">
                                <Field
                                    placeholder="Phone number"
                                    id="phone"
                                    name="phone" />
                                <div className="errorPhone">
                                    <ErrorMessage name='phone' />
                                </div>
                            </div>
                        </div>

                        <Field
                            placeholder="Password"
                            type="password"
                            id="password"
                            name="password" />
                        <div className="error">
                            <ErrorMessage name='password' />
                        </div>
                        <Field
                            placeholder="Confirm Password"
                            type="password"
                            id="re_password"
                            name="re_password" />
                        <div className="error">
                            <ErrorMessage name='re_password' />
                        </div>
                        <button type="submit">CREATE AN ACCOUNT</button>
                        <label>
                            Already have an account?
                            <Link to='/login'>
                                Login
                            </Link>
                        </label>
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

export default RegisterVal
