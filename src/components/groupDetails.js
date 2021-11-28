import React, {useState, useRef, useEffect} from 'react';
import '../App.css';
import InputField from '../util/inputField';
import { useHistory } from "react-router";

const GroupDetails = (props) => 
{
    //api service needed to view gc details
    const apiService = props.apiService;
    const roomId = props.match.params.roomId;
    const currentUser = props.currentUser;
    const userID = props.match.params.id;

    const [groupName, setGroupName] = useState("");
    const [groupDetails, setGroupDetails] = useState("[Put Details Here]");
    const [chatRoomDetails, setChatRoomDetails] = useState({});
    const [friends, setFriends] = useState([]);
    const [selectedFriends, setSelectedFriends] = useState([]);
    const [friendSearch, setFriendSearch] = useState("");
    const history = useHistory();

    async function fetchChatRoomDetails()
    {
        let response = await apiService.getChatRoomDetails(roomId);
        if(!response.ok)
        {
            return;
        }

        let json = await response.json();
        setChatRoomDetails(json);
        setGroupName(json.info.name);
        setGroupDetails(json.info.topic);
    }

    useEffect(() => fetchChatRoomDetails(), []);

    async function updateGroupDetails()
    {
        let response = await apiService.setChatRoomDetails({
            "name": groupName,
            "topic": groupDetails
        });
        if (response.ok)
        {
            history.push("/chatrooms/" + roomId);
        }
        console.log(response);
    }

    async function viewProfile()
    {
        return;
    }

    async function inviteMember()
    {
        let response = await apiService.inviteMember(roomId, userID);
        return;
    }

    async function leaveGroup()
    {
        let response = apiService.leaveGroup(roomId);
        return;
    }

    async function removeMember()
    {
        let response = apiService.removeMember(roomId, userID);
        return;
    }

    //Display the page/extra things to view on page
    const page = (
        <div className="container-fluid g-0">
        <p>
            <InputField value={groupName} onInput={setGroupName} label="Group Name:" type="text" id="groupName"/>
        </p>
        <p>
            <InputField value={groupDetails} onInput={setGroupDetails} label="Group Details:" type="text" id="groupDetail"/>
            <center><button class="edit-btn edit-btn1" onClick={updateGroupDetails}>Save</button></center>
        </p>
        </div>
    );

    return (
        <div>
        <div className="d-flex justify-content-center align-items-center">
          <div>
            {page}
            </div>
        </div>
        
        <div>
        <p>
            <center>
            <button class="edit-btn edit-btn1" onClick={inviteMember}>Invite Members</button>
            <button class="edit-btn edit-btn1" onClick={leaveGroup}>Leave Group</button>
            </center>
        </p>
        <p>
            <center>
            Group Members:
            <ul>
                {/*groupDetails.members.map(member => (
                    <li className="member-entry" key={member.id}>
                        <span>{member.profile.firstName + " " + member.profile.lastName}</span>
                        <button class="edit-btn edit-btn1" onClick={() => viewProfile(member.id)}>View Profile</button>
                        {(groupDetails.info.admin === currentUser.id) && 
                            <button class="edit-btn edit-btn1" onClick={() => removeMember(member.id)}>Remove Member</button>}
                    </li>
                        ))*/}
            </ul>
            </center>
        </p>
        </div>
        </div>
    );
};

export default GroupDetails;