/*import React from 'react';

function Login() {

  return(
    <div>This is a rectangle!
    <form>
      <label>
        <p>Username</p>
        <input type="text" />
      </label>
      <label>
        <p>Password</p>
        <input type="password" />
      </label>
      <div>
        <button type="submit">Submit</button>
      </div>
    </form>
    </div>
  );
}

export default Login;*/

import React from 'react';
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
        onSubmit(data);
    };
    return (
      <form style={formStyle} onSubmit={handleSubmit} >
        <Field ref={usernameRef} label="Username:" type="text" />
        <Field ref={passwordRef} label="Password:" type="password" />
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

export default SignUp;