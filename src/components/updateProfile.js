import React, {useState, useRef,useEffect} from 'react';
import InputField from '../util/inputField';
import ErrorInputField from '../util/errorInputField';
import '../App.css';

const textalign =  {
    textAlign: "center",
  }

const textBoxStyle = {
    width: "20%"
}



const UpdateProfile = (props) => {

    const apiService = props.apiService
    //const [buttonText, setButtonText] = useState("Yes"); //same as creating your state variable where "Next" is the default value for buttonText and setButtonText is the setter function for your state variable instead of setState
    //const [selected, setSelected] = useState({});
    const [loaded, setLoaded] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    function next() {

    }

    async function loadUser(){
        let response = await apiService.getCurrentUser();
        
        if (!response.ok) {
          setLoaded(false);
          return;
        }
        let json = await response.json();
        console.log(json);
        setFirstName(json.profile.firstName);
        setLastName(json.profile.lastName);
        /*let recuserId = json.userId;

        let userResponse = await apiService.getUser(recuserId);
        if (!userResponse.ok) {
          setLoaded(false);
          return;
        }
        let userJson = await userResponse.json();
        setSelected(userJson);*/
        setLoaded(true);
    }

    useEffect(() => loadUser(), []);

    const pages = [
        (
            <div className="container-fluid g-0">
            <p className="jam-title-text">Personal Information</p>
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
                    {/* <button className="jam-submit-button disabled" disabled>Back</button> */}
                </div>
                <div className="col-4"></div>
                <div className="col-4">
                    <button className="jam-submit-button" onClick={next}>Next</button>
                </div>  
            </div>
        </div>
        )
    ];

    return (

    
          
          <div className="d-flex justify-content-center align-items-center">
          <div className="jam-form">
          {pages[0]}
          
            </div>
            </div>
  
    );
};

export default UpdateProfile;