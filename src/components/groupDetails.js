import React, {useState, useRef, useEffect} from 'react';
import '../App.css';
import {Link} from 'react-router-dom';
import Alert from 'react-bootstrap/Alert'
import InputField from '../util/inputField';

const GroupDetails = (props) => 
{
    //api service needed to view gc details
    const apiService = props.apiService;
    const roomID = props.roomID;
    const currentUser = props.currentUser;

    const [groupName, setGroupName] = useState("");
    const [groupDetails, setGroupDetails] = useState("");
    const [loaded, setLoaded] = useState(false);
    const lastGroupDetails = useRef("");
    const lastGroupName = useRef("");

    async function fetchGroupDetails()
    {
        let response = await apiService.getChatRoomDetails(roomID);
        if(!response.ok)
        {
            /*Return Group not found in big letters*/
            return (
                <p>
                <center>
                    Error. Group Not Found.
                </center>
                </p>
            );
        }

        let json = await response.json();
        setGroupDetails(json);
        setLoaded(true);
    }

    async function updateGroupName()
    {
        let response = await apiService.setChatRoomDetails(roomID, groupName);
        lastGroupName.current = groupName;
        return;
    }

    async function updateGroupDetails()
    {
        let response = await apiService.setChatRoomDetails(roomID, groupDetails);
        lastGroupDetails.current = groupDetails;
        return;
    }

    async function viewProfile()
    {
        return;
    }

    async function inviteMember()
    {
        let response = await apiService.inviteMember(roomID, userID);
        return;
    }

    async function leaveGroup()
    {
        let response = apiService.leaveGroup(roomID);
        return;
    }

    async function removeMember()
    {
        let response = apiService.removeMember(roomID, userID);
        return;
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
            <InputField value={groupName} onInput={setGroupName} label="groupName:" type="groupName" />
            <button class="edit-btn edit-btn1" onClick={updateGroupName}>Save</button>
            </center>
        </p>
        <p>
            <center>
            Group Details: 
            <InputField value={groupDetails} onInput={setGroupDetails} label="groupDetails:" type="groupDetails" />
            <button class="edit-btn edit-btn1" onClick={updateGroupDetails}>Save</button>
            </center>
        </p>
        <p>
            <center>
            <button class="edit-btn edit-btn1" onClick={inviteMember}>Invite Members</button>
            <button class="edit-btn edit-btn1" onClick={leaveGroup}>Leave Group</button>
            </center>
        </p>
        <p>
            <center>
            Group Members:
            <ul style={groupDetails}>
                {groupDetails.members.map(members => (
                    <li className="member-entry" key={members}>
                        <span>{members}</span>
                        <button class="edit-btn edit-btn1" onClick={viewProfile}>View Profile</button>
                        {(roomID.info.admin === currentUser.id) && <button class="edit-btn edit-btn1" onClick={removeMember}>Remove Member</button>}
                    </li>
                ))}
            </ul>
            </center>
        </p>
        </div>
    );
};

export default GroupDetails;