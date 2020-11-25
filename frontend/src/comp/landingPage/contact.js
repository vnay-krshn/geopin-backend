import React from 'react'
import Footer from './footer'
import '../../css/landingPage/contact.css'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'

const initialValues = {
    name: '',
    email: '',
    message: ''
}

const onSubmit = values => {
    console.log('form values', values)
}

const validationSchema = Yup.object({
    name: Yup.string().required('Required'),
    email: Yup.string()
        .email('Invalid email format')
        .required('Required'),
    message : Yup.string().required('Required')
})

const Contact=()=>{
    return(
    <div className="footer-align">
        <div className="footer">
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
            <Form className="footer-form">
                    <Field 
                        type="text" 
                        placeholder="Name" 
                        id="nameFooter" 
                        name="name"/>
                        <div className="errorFooter">
                            <ErrorMessage name='name' />
                        </div>
                    <Field
                        placeholder="Email"
                        type="email"
                        id="emailFooter"
                        name="email" />
                        <div className="errorFooter">
                            <ErrorMessage name='email' />
                        </div>       
                    <Field
                        placeholder="Message"
                        as="textarea"
                        id="textareaFooter"
                        name="message" />
                        <div className="errorFooter">
                            <ErrorMessage name='message' />
                        </div> 
                    <button type="submit">SEND</button>
            </Form>
          </Formik>
            <div className="footer-details">
                <div className="footer-details-type">
                    <label>Email <pre>    :</pre></label>
                    <label>Phone <pre>   :</pre></label>
                    <label>Skype<pre>    :</pre></label>
                    <label>Address<pre>  :</pre></label>
                </div>
                <div className="footer-details-info">
                    <label>geo@geo.com</label>
                    <label>+91 9446578987</label>
                    <label>geopinloger</label>
                    <label id="addr">Building name, Streetname and Zip code<br></br>885865424</label>
                </div>
            </div>
        </div>
        <Footer/>       
    </div>)
}

export default Contact