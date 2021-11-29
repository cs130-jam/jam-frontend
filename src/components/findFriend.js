import React, {useState, useRef,useEffect} from 'react';
import ReactDOM from 'react-dom';
import '../App.css';
import ProfileImage from '../util/profileImage';


const button={
    cursor: 'pointer',
    border: '1px solid #1a202c',
    padding: '8px',
    width: '100px',

    background: 'rgb(48, 133, 214)',

    transition: 'all 0.1s ease-in',
    
    
  borderRadius: '5px',
  margin: '10px 10px'

  }


 const textalign =  {
    textAlign: "center",
  }

  const StyledTable = {
    
    margin: "auto"
  
  }

  const nameStyle = {
    color: "black",
    fontSize:"60px",
    //margin: '0px',
    fontFamily: "lato"
  };

  const bioStyle = {
    color: "black",
    fontSize:"30px",
    fontStyle:"italic",
    fontFamily: "lato"
  };

  const jobStyle = {
    color: "black",
    fontSize:"25px",
    
    fontFamily: "lato"
  };

  const JS = {
    color: "black",
    fontSize:"20px",
    fontWeight:"Bold",
    fontFamily: "lato"
  };

const FindFriend = (props) => {
    
    const apiService = props.apiService
    const [buttonText, setButtonText] = useState("Yes"); //same as creating your state variable where "Next" is the default value for buttonText and setButtonText is the setter function for your state variable instead of setState
    const [selected, setSelected] = useState({});
    const [loaded, setLoaded] = useState(false);
    const [timestamp, setTimestamp] = useState(Date.now());

    async function rejectMatch(){
        let response = await apiService.rejectMatch(selected.id);
        if (!response.ok) return;
        loadUser();
        
    }

    async function acceptMatch(){
        let response = await apiService.acceptMatch(selected.id);
        if (!response.ok) return;
        loadUser();
        
    }

    async function loadUser(){
        let response = await apiService.getRec();
        console.log(response);
        if (!response.ok) {
          setLoaded(false);
          return;
        }
        let json = await response.json();
        let recuserId = json.userId;

        let userResponse = await apiService.getUser(recuserId);
        if (!userResponse.ok) {
          setLoaded(false);
          return;
        }
        let userJson = await userResponse.json();
        setSelected(userJson);
        setLoaded(true);
        setTimestamp(Date.now());
    }

    
    useEffect(() => loadUser(), []);
    

    return ( loaded &&
        <div>
              <div style = {nameStyle} className="text-center">{selected.profile.firstName} {selected.profile.lastName}</div>
                     
                            <ProfileImage url={selected.profile.pfpUrl} size={350} timestap={timestamp}/>
                            <div style = {bioStyle} className="text-center">bio: {selected.profile.bio}</div> 
                            <table style = {StyledTable}><tr><td style = {JS}>Music Interests:</td><td style = {jobStyle} className="text-center">{selected.profile.musicInterests[0].name}, {selected.profile.musicInterests[1].name}, {selected.profile.musicInterests[2].name}</td></tr></table>      
                            <table style = {StyledTable}><tr><td style = {JS}>Instruments known:</td><td style = {jobStyle} className="text-center">{selected.profile.instruments.join(", ")}</td></tr></table>      
                                                    
                            <table style = {StyledTable}>   
                            <tr>
                            <td><button style = {button} onClick={acceptMatch }>{buttonText}</button> </td>
                            <td><button style = {button} onClick={ rejectMatch }>No</button></td>
                            
                            </tr>
                            </table>

                    


                

            
        </div>
    );
  };

export default FindFriend;


