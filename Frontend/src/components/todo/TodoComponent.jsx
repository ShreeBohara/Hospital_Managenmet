import { useAuth } from "./security/AuthContext"
import {Navigate, useNavigate, useParams} from 'react-router-dom'
import { createHospitalApi, retrieveHospitalApi, updateHospitalApi } from "./api/HospitalsApiService"
import { useEffect, useState } from "react"
import {ErrorMessage, Field, Form, Formik} from 'formik' // used for form programming
import moment from 'moment'
import * as Yup from 'yup'; // used for data validation
import './Beautiful.css';

const validationSchema = Yup.object().shape({
    hospitalName: Yup.string().required('Hospital Name is required'),
    hospitalAddress: Yup.string().required('Hospital Address is required'),
    firstContactName: Yup.string().required('Name is required'),
    firstContactEmail: Yup.string().email('Invalid email').required('Email is required'),
    firstContactNumber: Yup.string().required('Contact Number is required').matches(/^\d{10}$/, 'Contact Number must be exactly 10 digit number'),
    secondContactName: Yup.string().required('Name is required'),
    secondContactEmail: Yup.string().email('Invalid email').required('Email is required'),
    secondContactNumber: Yup.string().required('Contact Number is required').matches(/^\d{10}$/, 'Contact Number must be exactly 10 digit number'),
});

export function TodoComponent(){

    const {id} = useParams() // which id to edit, if -1 means to add
    
    const navigate = useNavigate();

    const[hospitalName,setHospitalName] = useState('')
    const[hospitalAddress,setHospitalAddress] = useState('')

    const[firstContactName,setFirstName] = useState('')
    const[firstContactEmail,setFirstEmail] = useState('')
    const[firstContactNumber,setFirstNumber] = useState('')

    const[secondContactName,setSecondName] = useState('')
    const[secondContactEmail,setSecondEmail] = useState('')
    const[secondContactNumber,setSecondNumber] = useState('')

    const authContext = useAuth()
    const username = authContext.username

    useEffect(// will come into effect when the page is loaded and retrieveTodo is called
        () => retrieveHospitalInfo, [id] 
    )

    function retrieveHospitalInfo(){
        if(id != -1){ // checkiing if we have to update the Todo or create a new one
            retrieveHospitalApi(username, id) // calling backend for fteching todo for a specific id
            .then(response => {
            //console.log("Inside ret 2" + response);
            //console.log(response.data);
            setHospitalName(response.data.hospitalName) 
            setHospitalAddress(response.data.hospitalAddress)

            setFirstName(response.data.firstName) 
            setFirstEmail(response.data.firstEmail)
            setFirstNumber(response.data.firstNumber) 

            setSecondName(response.data.secondName)
            setSecondEmail(response.data.secondEmail) 
            setSecondNumber(response.data.secondNumber)
            })
            .catch(error => console.log(error))
        }
        
    }

    function onsubmit(values){ // values will hold the updated fields of desc and date

        console.log("Inside onsubmit "+values);
        console.log(values);
        console.log("Firstname: ");
        console.log(values.firstContactNames);
        const hospital = {
            id,
            username,
            // extracting from values
            hospitalName:values.hospitalName, 
            hospitalAddress:values.hospitalAddress,

            firstName:values.firstContactName, 
            firstEmail:values.firstContactEmail,
            firstNumber:values.firstContactNumber, 

            secondName:values.secondContactName,
            secondEmail:values.secondContactEmail, 
            secondNumber:values.secondContactNumber,
            
        }
        console.log("Hospital:")
        console.log(hospital)

    
        if(id === -1){ // to add new todod
            createHospitalApi(username,hospital)
            .then(response => {
                console.log("Response from backend:" +response);
                navigate('/HospitalList')
            })
            .catch(error => console.log(error))
        }else{ // to update existing todo
            updateHospitalApi(username, id,hospital)
            .then(response => {
                console.log(response);
                navigate('/HospitalList') // once the Todo is updated it will be redirected to /todos
            })
            .catch(error => console.log(error))
        }
       
    }

    return(
        <div className="container">
            <h1>Enter Hospital Details</h1>
            <div>
               <Formik initialValues={{hospitalName,hospitalAddress,firstContactName,firstContactEmail,firstContactNumber,secondContactName,secondContactEmail,secondContactNumber}}
                enableReinitialize={true} //By default Formik does not reinitialize the values we hav to config it 
                onSubmit={onsubmit}
                validationSchema={validationSchema}
                //validate={validate} 
                //validateOnChange ={false} // will validate only if we click save
                //validateOnBlur={false}
               >  
                {
                    ({ isSubmitting  }) => (
                        <Form> {/* Formik element */}

                            <ErrorMessage 
                                name="description"
                                component="div"
                                className="alert alert-warning"
                            /> {/* Formik element for showing any error */}

                            <ErrorMessage 
                                name="targetDate"
                                component="div"
                                className="alert alert-warning"
                            /> {/* Formik element for showing any error */}

                            
                            <fieldset className="form-group">
                                <label>Hospital Name</label>
                                <Field type="text" className="form-control" name="hospitalName"/> {/* Formik element */}
                                <ErrorMessage name="hospitalName" component="div" className="error" />
                            </fieldset>

                            <fieldset className="form-group">
                                <label>Hospital Address</label>
                                <Field type="text" className="form-control" name="hospitalAddress"/> {/* Formik element */}
                                <ErrorMessage name="hospitalAddress" component="div" className="error" />
                            </fieldset>

                            <fieldset className="form-group">
                                <label>First Contact Name</label>
                                <Field type="text" className="form-control" name="firstContactName"/> {/* Formik element */}
                                <ErrorMessage name="firstContactName" component="div" className="error" />
                            </fieldset>
                            <fieldset className="form-group">
                                <label>First Contact Email</label>
                                <Field type="email" className="form-control" name="firstContactEmail"/> {/* Formik element */}
                                <ErrorMessage name="firstContactEmail" component="div" className="error" />
                            </fieldset>
                            <fieldset className="form-group">
                                <label>First Contact Number</label>
                                <Field type="number" className="form-control" name="firstContactNumber"/> {/* Formik element */}
                                <ErrorMessage name="firstContactNumber" component="div" className="error" />
                            </fieldset>

                            <fieldset className="form-group">
                                <label>Second Contact Name</label>
                                <Field type="text" className="form-control" name="secondContactName"/> {/* Formik element */}
                                <ErrorMessage name="secondContactName" component="div" className="error" />
                            </fieldset>
                            <fieldset className="form-group">
                                <label>Second Contact Email</label>
                                <Field type="text" className="form-control" name="secondContactEmail"/> {/* Formik element */}
                                <ErrorMessage name="secondContactEmail" component="div" className="error" />
                            </fieldset>
                            <fieldset className="form-group">
                                <label>Second Contact Number</label>
                                <Field type="text" className="form-control" name="secondContactNumber"/> {/* Formik element */}
                                <ErrorMessage name="secondContactNumber" component="div" className="error" />
                            </fieldset>
                            <div>
                                <button className="btn btn-success m-5" type="submit" disabled={isSubmitting}>Save</button>
                            </div>
                        </Form>
                    )
                }
               </Formik>
            </div>
        </div>
    )
}



