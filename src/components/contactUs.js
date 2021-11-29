import React, {useState} from 'react';
import { useHistory } from "react-router-dom";
import '../App.css';
import {Link} from 'react-router-dom';
import Alert from 'react-bootstrap/Alert'
import InputField from '../util/inputField';

const linkStyle = {
    color: 'black'
};

const linkContainer = {
    textAlign: "center",
    width: "100%",
    display: "inline-block",
};

const alertStyle = {
    top: '0'
};

const msgStyle = {
 width: "400px",
 height: "200px"
};

const ContactUs = (props) => {
    
    
    const history = useHistory();

    const [username, setUsername] = useState("");
    const [mail, setMail] = useState("");
    const [message, setMessage] = useState("");

    async function handleLogin(loginData) {
        
            history.push("/login");
       
    }

    function handleSubmit(e) {
        e.preventDefault();
        handleLogin({
          username: username,
          mail: mail,
          message: message
        });
    };

    function onUsername(name) {
      setUsername(name);
    }

    function onMail(mail) {
        setMail(mail);

    }

    function onMessage(message) {
      setMessage(message);

  }

    return (
        <div className="d-flex justify-content-center align-items-center">
            <form className="jam-form" onSubmit={handleSubmit}>
          
                <p className="jam-title-text">Contact Us</p>
                <InputField label="Enter your Email ID: " type="text" value={mail} onInput={onMail}/>
                <InputField label="Enter your Name: " type="text" value={username} onInput={onUsername}/>
                <br/>
                <textarea style={msgStyle}>
                    Enter your message here
                </textarea>
                
                <div>
                    <button className="jam-submit-button" type="submit">Submit</button>
                </div>

            </form>
        </div>
    );
};

export default ContactUs;


