/*import React from 'react';
import ReactDOM from 'react-dom';

const appStyle = {
    height: '250px',
    display: 'flex'
};

const formStyle = {
    margin: '100px 500px 100px 550px',
    padding: '30px 30px 30px 30px',
    border: '1px solid #c9c9c9',
    borderRadius: '5px',
    background: '#f5f5f5',
    height: '300px',
    width: '400px',
    display: 'block'
};

const labelStyle = {
    margin: '10px 0 5px 0',
    fontFamily: 'Arial, Helvetica, sans-serif',
    fontSize: '15px',
};

const inputStyle = {
    margin: '5px 0 10px 0',
    padding: '5px', 
    border: '1px solid #bfbfbf',
    borderRadius: '3px',
    boxSizing: 'border-box',
    width: '100%'
};

const submitStyle = {
    margin: '10px 0 0 0',
    padding: '7px 10px',
    border: '1px solid #efffff',
    borderRadius: '3px',
    background: '#3085d6',
    width: '100%', 
    fontSize: '15px',
    color: 'white',
    display: 'block'
};

const Field = React.forwardRef(({label, type}, ref) => {
    return (
      <div>
        <label style={labelStyle} >{label}</label>
        <input ref={ref} type={type} style={inputStyle} />
      </div>
    );
});

const Form = ({onSubmit}) => {
  console.log("hi1");
    const firstnameRef = React.useRef();
    const lastnameRef = React.useRef();
    const emailRef = React.useRef();
    const passwordRef = React.useRef();
    const confirmpasswordRef = React.useRef();
    const handleSubmit = e => {
        e.preventDefault();
        const data = {
            firstname: firstnameRef.current.value,
            lastname: lastnameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value,
            confirmpassword: confirmpasswordRef.current.value
        };
        console.log("hi2"); 
        console.log(data);
        onSubmit(data);
    };
    return (
      <form style={formStyle} onSubmit={handleSubmit} >
        <Field ref={firstnameRef} label="First Name:" type="text" />
        <Field ref={lastnameRef} label="Last Name:" type=" text" />
        <Field ref={emailRef} label="Email Address:" type=" text" />
        <Field ref={passwordRef} label="Password:" type="password" />
        <Field ref={confirmpasswordRef} label="Password:" type="password" />
        <div>
          <button style={submitStyle} type="submit">Submit</button>
        </div>
      </form>
    );
};

// Usage example:

const SignUp = () => {
  console.log("hi3");
    const handleSubmit = data => {
        const json = JSON.stringify(data, null, 4);
        //console.clear();
        console.log("hi4");
        console.log(json);
    };
    return (
      <div style={appStyle}>
        <Form onSubmit={handleSubmit} />
      </div>
    );
};

export default SignUp;*/

import React from 'react';
import '../App.css';
//import './signup.css';
import {Link} from 'react-router-dom';
import JamAPIService from '../services/jamService.js';

const linkStyle = {
    color: 'black',
    margin: '110px'
};


const formStyle = {
  height: '800px'
};

const Field = React.forwardRef(({label, type}, ref) => {
    return (
      <div>
        <label className="form-label">{label}</label>
        <input className="form-input" ref={ref} type={type} />
      </div>
    );
});



const SignUp = () => {
    const firstnameRef = React.useRef();
    const lastnameRef = React.useRef();
    const usernameRef = React.useRef();
    const passwordRef = React.useRef();
    const confirmpasswordRef = React.useRef();

    const handleSubmit = e => {
        e.preventDefault();
        const data = {
            firstname: firstnameRef.current.value,
            lastname: lastnameRef.current.value,
            username: usernameRef.current.value,
            password: passwordRef.current.value
        };

        console.log(data);
        JamAPIService.signup(data).then((res)=> {
            console.log(res); 
        });
    };

    return (
        <div className="d-flex justify-content-center align-items-center">
           
            <form className="form" style={formStyle} onSubmit={handleSubmit}>
            <p className="title-text"> Sign Up </p>
                <Field ref={firstnameRef} label="First Name:" type="text" />
                <Field ref={lastnameRef} label="Last Name:" type="text" />
                <Field ref={usernameRef} label="Email Address:" type="text" />
                <Field ref={passwordRef} label="Password:" type="password" />
                <Field ref={confirmpasswordRef} label="Confirm Password:" type="password" />
                <label htmlFor="artist-search" className="form-label">
                  <span >Add Favourite Artists</span>
                </label>
                <br/>
                <input
                  type="text"
                  id="artist-search"
                  placeholder="artists"
                  name="s" 
                />
                <button type="submit">Search</button>
                <label htmlFor="instrument-search" className="form-label">
                  <span >Add Interested Instruments</span>
                </label>
                <br/>
                <input
                  type="text"
                  id="instrument-search"
                  placeholder="artists"
                  name="s" 
                />
                <button type="submit">Search</button>
                <br/>
                <br/>
                <div>
                    <button className="submit-button" type="submit">Submit</button>
                </div>  
            </form>
        </div>
    );
};

export default SignUp;