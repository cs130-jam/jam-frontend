import React, {useState, useRef,useEffect} from 'react';
import ReactDOM from 'react-dom';
import '../App.css';


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
    fontSize:"100px",
    margin: '0px',
    fontFamily: "lato"
  };

  const bioStyle = {
    color: "black",
    fontSize:"40px",
    fontStyle:"italic",
    fontFamily: "lato"
  };

  const jobStyle = {
    color: "black",
    fontSize:"30px",
    
    fontFamily: "lato"
  };


const users = [
    {
        profile:{
      firstName: 'Charlie',
      lastName:'Chap'
                },
    instruments: ['guitar','drums'],            
    bio:"this is my bio"
    },
    {profile:{
      firstName: 'Mac',
      lastName: 'Musk'
    },
    instruments: ['Sitar','Piano'],
    bio: "this is mac's bio"
    },

    {profile:{
        firstName: 'Andrew',
        lastName: 'Cummings'
      },
      instruments: ['guitar','drums','guitar','drums','guitar','drums'],
      bio: "this is Andrew's bio"
      },

      {profile:{
        firstName: 'Keerthi',
        lastName: 'Sri'
        
      },
      instruments: ['sings'],
      bio: "this is K's bio"
      },
    
  ];
const FindFriend = (props) => {
    
    const apiService = props.apiService
    const [buttonText, setButtonText] = useState("Yes"); //same as creating your state variable where "Next" is the default value for buttonText and setButtonText is the setter function for your state variable instead of setState
    const [selected, setSelected] = useState({});
    const [loaded, setLoaded] = useState(false);

    async function rejectMatch(){
        let response = await apiService.current.rejectMatch(selected.id);
        if (!response.ok) return;
        loadUser();
        
    }

    async function acceptMatch(){
        let response = await apiService.current.acceptMatch(selected.id);
        if (!response.ok) return;
        loadUser();
        
    }

    async function loadUser(){
        let response = await apiService.current.getRec();
        if (!response.ok) {
          setLoaded(false);
          return;
        }
        let json = await response.json();
        let recuserId = json.userId;

        let userResponse = await apiService.current.getUser(recuserId);
        if (!userResponse.ok) {
          setLoaded(false);
          return;
        }
        let userJson = await userResponse.json();
        setSelected(userJson);
        setLoaded(true);
    }

    
    useEffect(() => loadUser(), []);
    

    return ( loaded &&
        <div>
            
            
                

                    
                            
                            
                    
                            <div style = {nameStyle} className="text-center">{selected.profile.firstName} {selected.profile.lastName}</div>
                            

                    

                    
                           
                            <div style = {jobStyle} className="text-center">{selected.profile.instruments.join(" ")}</div>
                            

                   
                           
                            <div style = {bioStyle} className="text-center">{selected.profile.bio}</div>
                            

                    
                         <table style = {StyledTable}>   
                            <tr>
                            <td><button style = {button} onClick={acceptMatch }>{buttonText}</button> </td>
                            <td><button style = {button} onClick={ rejectMatch }>NO</button></td>
                            
                            </tr>
                            </table>

                    


                

            
        </div>
    );
  };

export default FindFriend;


