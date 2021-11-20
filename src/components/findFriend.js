import React, {useState, useRef,useEffect} from 'react';
import ReactDOM from 'react-dom';



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
            <div className = "row">
                <table className = "table">

                    
                    <tbody>
                    <tr>
                            <th>{users[selected].profile.name}</th>
                            

                    </tr>

                    <tr>
                           
                            <th>{users[selected].profile.job}</th>
                            

                    </tr>
                    <tr>
                           
                            <th>{users[selected].bio}</th>
                            

                    </tr>

                    <tr>
                            
                            <th><button onClick={handleAssigneeOnClick }>{buttonText}</button></th>
                            <th><button onClick={handleAssigneeOnClick }>NO</button></th>
                            

                    </tr>
                    
                    </tbody>


                </table>


            </div>
        </div>
    );
  };

export default FindFriend;


