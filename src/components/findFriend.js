import React, {useState, useRef,useEffect} from 'react';
import ReactDOM from 'react-dom';
import '../App.css';


const button={
    cursor: 'pointer',
    border: '1px solid #1a202c',
    padding: '8px',
    minWidth: '64px',

    background: 'rgb(48, 133, 214)',

    transition: 'all 0.1s ease-in',
  }


 const textalign =  {
    textAlign: "center",
  }

const users = [
    {
        profile:{
      name: 'Charlie',
      job: 'Janitor',
                },
    bio:"this is my bio"
    },
    {profile:{
      name: 'Mac',
      job: 'Bouncer',
    },
    bio: "this is mac's bio"
    },
    
  ];
const FindFriend = () => {
    
    
    const [buttonText, setButtonText] = useState("Send Request"); //same as creating your state variable where "Next" is the default value for buttonText and setButtonText is the setter function for your state variable instead of setState
    const [selected, setSelected] = useState(0);
    

    function handleAssigneeOnClick(){
        setSelected(prev => {
            if (prev === users.length - 1) {
              return 0;
            } else {
              return prev + 1;
            }
          });
        
    };


    

    return (
        <div>
            <h2 className="text-center">Suggestions</h2>
            
                

                    
                    
                    
                            <div className="text-center">{users[selected].profile.name}</div>
                            

                    

                    
                           
                            <div>{users[selected].profile.job}</div>
                            

                   
                           
                            <div>{users[selected].bio}</div>
                            

                    
                         <table className = "jam-title-text">   
                            <tr>
                            <td><button style = {button} onClick={handleAssigneeOnClick }>{buttonText}</button> </td>
                            <td><button style = {button} onClick={handleAssigneeOnClick }>NO</button></td>
                            
                            </tr>
                            </table>

                    


                

            
        </div>
    );
  };

export default FindFriend;


