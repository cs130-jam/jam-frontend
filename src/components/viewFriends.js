import React, {useState, useRef,useEffect} from 'react';
import ReactDOM from 'react-dom';
import '../App.css';
import classNames from 'classnames';
import styles from './mystyle.module.css'; 
import { useHistory } from "react-router-dom";
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
  


  const fr = [
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

  const ViewFriends = (props) => {
   const apiService = props.apiService
   const [user, setUsers] = useState([]);
    const [loadeds, setLoadeds] = useState(false);
    const history = useHistory();
    async function loadUsers(){
        let response = await apiService.getFriendIds();
        if (!response.ok) return;
        let friendIds = await response.json();
        let friendsResponses = await Promise.all(friendIds.map(id => apiService.getUser(id)));
        let friends = await Promise.all(friendsResponses.map(resp => resp.json()));
        console.log(friends);
        if(friends.length > 0)
        setUsers(friends);
        else return;
      }
//api to take to the chatroom
      async function handleClick(){
        console.log(user.id);
        let response = await apiService.getCurrentUserChatroom(user.id);   
        if (!response.ok) return;
        let json = await response.json();
        //console.log(json);
        let chatroomId = json.roomId;
        let path = '/chatrooms/${chatroomId}'      
        history.push(path);
      }

    
    
   useEffect(() => loadUsers(), []);
   return (  
    <div className="container">
        <h3 className="p-3 text-center">My Friends</h3>
        <table className="table table-striped table-bordered" style = {StyledTable}>
            <thead>
                <tr>
                    <th>Name</th>
                   
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
               {user && user.map(user =>
                    <tr key = {user.id}>
                        <td>{user.profile.firstName} {user.profile.lastName}</td>
                        
                        <td><button onClick = {handleClick}>Message</button></td>
                    </tr>
                )}
            </tbody>
        </table>
    </div>
);
               }
                           
                           export default ViewFriends;