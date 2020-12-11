import React,{useState} from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Link , Redirect, Route} from 'react-router-dom'

const initialValues = {
    email: ''
}

const validationSchema = Yup.object({
    email: Yup.string()
        .email('Invalid email format')
        .required('Required')
})

const ForgotPassword=()=>{

    const [displayStatus, setDisplayStatus] = useState(false)
    const [statusMessage, setStatusMessage]= useState("")

     const submit = e =>{
        let user ={ email:e.email, password:e.password }
    }

    return (
            <div className="login">
                <Link to='/'>
                    <img src='/imgs/logo.svg'></img>
                </Link>
                <div className="login-box">
                    <h3>RESET PASSWORD</h3>
                 <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={(e)=>submit(e)}>
                        <Form className="login-form">
                            <div className="form-control">
                                <Field
                                    placeholder="Email"
                                    type="email"
                                    id="email"
                                    name="email" />
                                <div style={{ color: 'rgb(241, 151, 151)'}}>
                                    <ErrorMessage name='email' />
                                </div>
                            </div>
                            <button type="submit">RESET</button>
                        </Form>
                    </Formik>
                    {displayStatus && (<span id="successMessage">{statusMessage}</span>)}
                </div>
            </div>
        )
}

export default ForgotPassword