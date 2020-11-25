import React, { useEffect, useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Link ,Redirect} from 'react-router-dom'
import ReactFlagsSelect from 'react-flags-select';
import 'react-flags-select/css/react-flags-select.css';
import axios from 'axios'


const initialValues = {
    username: '',
    email: '',
    phone: '',
    password: '',
    re_password: ''
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

const RegisterVal=()=>{

    const flop=()=>{
        const temp = document.querySelector('.flag-select__option')
        console.log(temp)
        if(temp.children.length)
       {    
            const temp2 = document.querySelector('.flag-select__option__label')
            console.log(temp2.textContent)
        }
    }
    
    let error ={message:''}
    let flag 

    const submit = e =>{
        //console.log(flag)
        let user ={ username: e.username, email:e.email, password:e.password,phone:e.phone,flag:flag }
        axios.post('http://localhost:4000/register',user)
                .then(res=>{
                        if(res.data.message==='email already exists'){
                            error.message=res.data.message
                            alert(error.message)
                        }
                        else{
                           console.log(res.data.token)
                           return <Redirect to='/login'/>
                        }
                    }
                    )
    }


    const flagSelect=(e)=>{
        flag=e
    }
  
     
    return (
            <div className="register">
                <Link to='/'>
                    <img src='/imgs/logo.svg'></img>
                </Link>
                <div className="register-box">
                    <h3>REGISTER</h3>
                    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={(e)=>submit(e)}>
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
                                        showOptionLabel={false}
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
                  
                </div>
            </div>

        )
}

export default RegisterVal
