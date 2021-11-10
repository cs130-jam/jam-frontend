import React from 'react';
import '../App.css';
import {Link} from 'react-router-dom';
import JamService from '../services/jamService.js';

const linkStyle = {
    color: 'black',
    margin: '110px'
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
    console.log("hi1");
    const usernameRef = React.useRef();
    const passwordRef = React.useRef();

    const handleSubmit = e => {
        e.preventDefault();
        const data = {
            username: usernameRef.current.value,
            password: passwordRef.current.value
        };
        console.log("hi2"); 
        console.log(data);
        JamService.login(data).then((res)=> {
            console.log("hi");  
            console.log(res); 
        });
    };

    return (
        <div className="d-flex justify-content-center align-items-center">
            <form className="form" onSubmit={handleSubmit}>
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