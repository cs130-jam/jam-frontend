import React, {useState, useRef} from 'react';
import '../App.css';
import {Link} from 'react-router-dom';
import JamAPIService from '../services/jamService.js';
import Alert from 'react-bootstrap/Alert'

const linkStyle = {
    color: 'black',
    margin: '110px'
};


const alertStyle = {
  top: '0'
};

const Field = React.forwardRef(({label, type}, ref) => {
    return (
      <div>
        <label className="form-label">{label}</label>
        <input className="form-input" ref={ref} type={type} />
      </div>
    );
});

const Login = () => {
    const usernameRef = useRef();
    const passwordRef = useRef();
    const [isValid, setIsValid] = useState(true);

    const handleSubmit = e => {
        e.preventDefault();
        const data = {
            username: usernameRef.current.value,
            password: passwordRef.current.value
        };

        if(passwordRef.current.value == "wrong") {
            setIsValid(false);
        }
        console.log(data);
        /*JamAPIService.login(data).then((res)=> {
            console.log(res); 
        });*/
    };

    
    return (
        <div className="d-flex justify-content-center align-items-center">
       
            <form className="form" onSubmit={handleSubmit}>
            {!isValid && <Alert style={alertStyle} variant="danger">Invalid Credentials! Try again</Alert>}
           <p className="title-text"> Login </p>
                <Field ref={usernameRef} label="Username:" type="text" />
                <Field ref={passwordRef} label="Password:" type="password" />
                <div>
                    <button className="submit-button" type="submit">Submit</button>
                </div>
                <br/>
                <Link style={linkStyle} to="/sign-up">Create Account</Link>
            </form>
        </div>
    );
};

export default Login;