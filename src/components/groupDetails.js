import React, {useState, useRef, useEffect} from 'react';
import '../App.css';
import {Link} from 'react-router-dom';
import Alert from 'react-bootstrap/Alert'
import InputField from '../util/inputField';

const GroupDetails = (props) => 
{
    //api service needed to view gc details
    const apiService = props.apiService;

    const [groupDetails, setGroupDetails] = useState("");
    const [loaded, setLoaded] = useState(false);
    
    async function fetchGroupDetails()
    {
        setGroupDetails(
        {
            "id": "Cum",
            "members": ["Cum1", "Cum2", "Cum3", "Cum4"], // list of user UUIDs
            "updated": 0, // milliseconds since epoch
            "isDirectMessage": false,
            "info": {
                "name": "CuSandwich",
                "topic": "Cum Snad Witch"
            }
        });
        setLoaded(true);
    }

    const groupNameStyle = {
        margin: "2px",
        padding: "2px",
        listStyleType: "none"
    }

    useEffect(() => fetchGroupDetails(), []);

    //Display the page/extra things to view on page
    return (
        loaded && 
        <div>
        <center>
            <img class="group-chat-pic" src="https://m.media-amazon.com/images/I/51Z7IMEhjKL._AC_SX425_.jpg" alt="Pfp" width="144" height="144"></img>
            <button class="edit-btn edit-btn1">Change Image</button>
        </center>
        <p>
            <center>
            Group Name: 
            {groupDetails.info.name}
            <button class="edit-btn edit-btn1"><i class="icon-pencil"></i>Edit</button>
            </center>
        </p>
        <p>
            <center>
            Group Details: 
            {groupDetails.info.topic}
            <button class="edit-btn edit-btn1">Edit</button>
            </center>
        </p>
        <p>
            <center>
            Group Members:
            <ul style={groupDetails}>
                {groupDetails.members.map(members => (
                    <li className="member-entry" key={members}>
                        <span>{members}</span>
                        <button class="edit-btn edit-btn1">View Profile</button>
                        <button class="edit-btn edit-btn1">Remove Member</button>
                    </li>
                ))}
            </ul>
            </center>
        </p>
        </div>
    );
};

export default GroupDetails;