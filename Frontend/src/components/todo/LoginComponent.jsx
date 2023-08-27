import { useState } from 'react'
import {useNavigate} from 'react-router-dom'
import { useAuth } from './security/AuthContext';
import { Button } from 'primereact/button';

import '../../App.css'


export default function LoginComponent(){
    const navigate = useNavigate(); // for navigating from one comp to another
    const [username, setUserName] = useState('') // for username
    const [password, setPassword] = useState('') // for password
    const[loginMessage, setLoginMessage] = useState('')
    const [isValid, setIsValid] = useState(true); // to check if password contains all the constraints
    const [errors, setErrors] = useState([]); // to display that any constraints is missing
    const [buttonClicked, setButtonClicked] = useState(false);// Track if the button was clicked

    const authContext = useAuth();

    function handleUsernameChange(event){
            //console.log(event.target.value);
            
            setUserName(event.target.value) 
    }

    function handlePasswordChange(event){
        //console.log(event.target.value);
        const newPassword = event.target.value; // getting value of passpord from event
        const isValidPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+])(?=.{8,})/.test(newPassword);
    
        setPassword(newPassword);
        setIsValid(isValidPassword);

        const newErrors = [];
        if (newPassword.length < 8) {
            newErrors.push('Password must be at least 8 characters long');
          }

        if (!/(?=.*[a-z])/.test(newPassword)) {
        newErrors.push('Lowercase letter is missing');
        }

        if (!/(?=.*[A-Z])/.test(newPassword)) {
        newErrors.push('Uppercase letter is missing');
        }

        if (!/(?=.*[0-9])/.test(newPassword)) {
        newErrors.push('Number is missing');
        }

        if (!/(?=.*[!@#$%^&*()_+])/.test(newPassword)) {
        newErrors.push('Special character is missing');
        }

        setErrors(newErrors);
        
    }

    async function handleLoginMessage(event){ // since the login function in AuthContext is also asyn this should also be async
        if(await authContext.login(username,password)){ // login fun is in  context to make our code maintable and await for the response
           // authContext.setAuthenticated(true); //useing context to set value of authenticated as true
           console.log("INside Login Component success");
            setLoginMessage("Success");
            navigate(`/welcome/${username}`);// if login success the navigate to welcome comp
            
        }else{
            //authContext.setAuthenticated(false);
            setLoginMessage("Wrong Credintials");
        }
        setButtonClicked(true); // Set the button-clicked state to true
    }

    return(


        <div className="container mt-5">
        <div className="row justify-content-center">
            <div className="col-md-6">
            <div className="card p-4">
                <h1 className="text-center">Login Please</h1>
                <div className="success-message text-success text-center">
                {loginMessage}
                </div>
                {buttonClicked && !isValid && errors.length > 0 &&(
                <div className="error-message text-danger">
                    <p>The following criteria are not met:</p>
                    <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                    {errors.map((error, index) => (
                        <li key={index}>{error}</li>
                    ))}
                    </ul>
                </div>
                )}
                <div className="form-group">
                <label>User Name</label>
                <input
                    type="text"
                    className="form-control"
                    name="username"
                    value={username}
                    onChange={handleUsernameChange}
                />
                </div>
                <div className="form-group">
                <label>Password</label>
                <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={password}
                    onChange={handlePasswordChange}
                />
                </div>
                <Button
                label="Login"
                name="login"
                onClick={handleLoginMessage}
                className="p-button-primary btn-block"
                />
            </div>
            </div>
        </div>
    </div>
    )
}