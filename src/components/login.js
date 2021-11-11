import React, {useState, useRef} from 'react';
import '../App.css';
import {Link} from 'react-router-dom';
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

const Login = (props) => {
    const setSessionToken = props.setSessionToken;
    const apiService = props.apiService;
    const [isValid, setIsValid] = useState(true);

    const usernameRef = React.useRef();
    const passwordRef = React.useRef();

    async function handleLogin(loginData) {
        if(loginData.password == "wrong") {
            setIsValid(false);
        }

        let response = await apiService.current.login(loginData);
        if (response.ok) {
            let json = await response.json();
            console.log(json);
        } else {
            let error = await response.json();
            if (error.status == 401) {
                alert("Invalid username or password");
            } else {
                console.log(error);
            }
        }
    }

    const handleSubmit = e => {
        e.preventDefault();
        handleLogin({
            username: usernameRef.current.value,
            password: passwordRef.current.value
        });
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