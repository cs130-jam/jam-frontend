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

import React, {useEffect, useRef, useState} from 'react';
import '../App.css';
import InputField from '../util/inputField';
import useInterval from '../util/useInterval';
import ErrorInputField from '../util/errorInputField';
import DropdownField from '../util/dropdownField';

const CHECK_USERNAME_DELAY = 2000; // every 2 seconds

const Field = React.forwardRef(({label, type}, ref) => {
    return (
        <div>
            <label className="jam-form-label">{label}</label>
            <input className="jam-form-input" ref={ref} type={type} />
        </div>
    );
});

const instrumentsListStyle = {
    margin: "0px",
    padding: "0px",
    listStyleType: "none"
}

const SignUp = (props) => {
    const setSessionToken = props.setSessionToken;
    const apiService = props.apiService;

    const [isValidUsername, setIsValidUsername] = useState(true);
    const [username, setUsername] = useState("");
    const lastUsername = useRef("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const [instruments, setInstruments] = useState([]);
    const [filteredInstruments, setFilteredInstruments] = useState([]);
    const [knownInstruments, setKnownInstruments] = useState([]);
    const [instQuery, setInstQuery] = useState("");

    const [pageIndex, setPageIndex] = useState(0);

    async function checkUsername() {
        if (username === lastUsername.current) return isValidUsername;

        let response = await apiService.current.existingUser(username);
        setIsValidUsername(response.ok);
        lastUsername.current = username;
        return response.ok;
    }

    useInterval(checkUsername, CHECK_USERNAME_DELAY);

    async function userCredentials() {
        if (password !== confirmPassword || password === "" || username === "") {
            return;
        }

        let validUsername = await checkUsername();
        if (!validUsername) {
            return;
        }

        setPageIndex(pageIndex + 1);
    }

    function userNames() {
        if (firstName.length === 0) {
            return;
        }

        setPageIndex(pageIndex + 1);
    }

    function prevPage() {
        setPageIndex(pageIndex - 1);
    }

    function getFilteredInstruments(query) {
        query = query.toLowerCase();
        return instruments.filter(instrument => {
            const compareLength = Math.min(query.length, instrument.length);
            return query.substring(0, compareLength) === instrument.substring(0, compareLength).toLowerCase();
        })
    }
    useEffect(() => {
        setFilteredInstruments(getFilteredInstruments(instQuery));
    }, [instQuery, instruments]);

    function onInstrumentSelect(instrument) {
        if (knownInstruments.includes(instrument.name)) return;
        setKnownInstruments([...knownInstruments, instrument.name]);
    }

    async function getInstruments() {
        let response = await apiService.current.getInstruments();
        let json = await response.json();
        setInstruments(json);
    }
    useEffect(() => getInstruments(), []);

    // const handleSubmit = e => {
    //     e.preventDefault();
    //     const data = {
    //         firstname: firstnameRef.current.value,
    //         lastname: lastnameRef.current.value,
    //         username: usernameRef.current.value,
    //         password: passwordRef.current.value
    //     };

    //     console.log(data);
    //     JamAPIService.signup(data).then((res)=> {
    //         console.log(res); 
    //     });
    // };

    const pages = [
        (
            <div className="container-fluid g-0">
                <p className="jam-title-text">Sign Up</p>
                <ErrorInputField 
                    value={username} 
                    onInput={setUsername}
                    label="Username: " 
                    type="text" 
                    isError={!isValidUsername} 
                    message="Username taken"/>
                <InputField value={password} onInput={setPassword} label="Password:" type="password" />
                <ErrorInputField 
                    value={confirmPassword}
                    onInput={setConfirmPassword}
                    label="Confirm Password: " 
                    type="password" 
                    isError={password !== confirmPassword}
                    message="Passwords must match"/>
                <div className="row g-0">
                    <div className="col-4">
                        {/* <button className="jam-submit-button disabled" disabled>Back</button> */}
                    </div>
                    <div className="col-4"></div>
                    <div className="col-4">
                        <button className="jam-submit-button" onClick={userCredentials}>Next</button>
                    </div>  
                </div>
            </div> 
        ),
        (
            <div className="container-fluid g-0">
                <p className="jam-title-text">Sign Up</p>
                <ErrorInputField 
                    value={firstName}
                    onInput={setFirstName}
                    label="First Name: " 
                    type="text" 
                    isError={firstName.length === 0}
                    message="First name is required"/>
                <InputField value={lastName} onInput={setLastName} label="Last Name:" type="text" />
                <div className="row g-0">
                    <div className="col-4">
                        <button className="jam-submit-button" onClick={prevPage}>Back</button>
                    </div>
                    <div className="col-4"></div>
                    <div className="col-4">
                        <button className="jam-submit-button" onClick={userNames}>Next</button>
                    </div>  
                </div>
            </div> 
        ),
        (
            <div className="container-fluid g-0">
                <p className="jam-title-text">Sign Up</p>
                <DropdownField 
                    value={instQuery}
                    onInput={setInstQuery}
                    label="Known Instruments:" 
                    type="text"
                    hasMore={false}
                    onSelect={onInstrumentSelect}
                    entries = {filteredInstruments.map(inst => {return {
                        name: inst, 
                        html: (<span>{inst}</span>)
                    }})}/>
                <ul style={instrumentsListStyle}>
                    {knownInstruments.map(instrument => (
                        <li className="removable-list-entry" key={instrument}>
                            <span>{instrument}</span>
                            <button>x</button>
                        </li>
                    ))}
                </ul>
            </div>
        ),
        (
            <div className="container-fluid g-0">
                <p className="jam-title-text">Sign Up</p>
                <label htmlFor="artist-search" className="jam-form-label">
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
                <div>
                    <button className="submit-button" type="submit">Submit</button>
                </div> 
            </div> 
        )
    ];

    return (
        <div className="d-flex justify-content-center align-items-center">
            <div className="jam-form">
                {pages[pageIndex]}
            </div>
        </div>
    );
};

export default SignUp;