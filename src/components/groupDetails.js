import React, {useState, useRef, useEffect} from 'react';
import '../App.css';
import { Link } from "react-router-dom";
import * as FaIcons from 'react-icons/fa';
import InputTextarea from '../util/inputTextarea';
import DropdownField from '../util/dropdownField';
import { useHistory } from "react-router";
import ErrorInputField from '../util/errorInputField';

function matchingPrefixIgnoreCase(prefix, entry) {
    const compareLength = Math.min(prefix.length, entry.length);
    return prefix.substring(0, compareLength).toLowerCase() === entry.substring(0, compareLength).toLowerCase();
}

const subButtonStyle = {
    marginTop: "8px",
    marginBottom: "0px"
};

const memberListStyle = {
    margin: "0px",
    padding: "0px",
    listStyleType: "none"
};

const infoIconStyle = {
    fontSize: "17pt",
    float: "right",
    margin: "0px",
    marginTop: "2px"
};

const removeIconStyle = {
    fontSize: "17pt",
    float: "right",
    margin: "0px",
    marginTop: "2px",
    marginRight: "8px"
};

const no_op = () => null;

const GroupDetails = (props) => 
{
    //api service needed to view gc details
    const apiService = props.apiService;
    const currentUser = props.currentUser;
    const roomId = props.match.params.roomId;

    const [groupName, setGroupName] = useState("");
    const [groupDetails, setGroupDetails] = useState("");
    const [groupMembers, setGroupMembers] = useState([]);
    const [groupAdmin, setGroupAdmin] = useState("");
    const history = useHistory();

    const [friends, setFriends] = useState([]);
    const [friendSearch, setFriendSearch] = useState("");

    async function fetchChatRoomDetails()
    {
        let response = await apiService.getChatRoomDetails(roomId);
        if(!response.ok)
        {
            return;
        }

        let json = await response.json();
        setGroupName(json.info.name);
        setGroupDetails(json.info.topic);
        setGroupAdmin(json.info.admin);
        let memberResponse = await Promise.all(json.members.map(id => apiService.getUser(id)));
        let members = await Promise.all(memberResponse.map(resp => resp.json()));
        setGroupMembers(members);

        response = await apiService.getFriendIds();
        if (!response.ok) return;
        let friendIds = await response.json();

        let friendsResponses = await Promise.all(friendIds.map(id => apiService.getUser(id)));
        let friends = await Promise.all(friendsResponses.map(resp => resp.json()));
        setFriends(friends);
    }

    useEffect(() => fetchChatRoomDetails(), []);

    async function updateGroupDetails()
    {
        let response = await apiService.setChatRoomDetails(roomId,
        {   
            "name": groupName,
            "topic": groupDetails
        });
        if (!response.ok)
        {
            return;
        }
    }

    function viewProfile(userId)
    {
        history.push(`/user/${userId}`);
    }

    async function leaveGroup()
    {
        let response = await apiService.leaveGroup(roomId);
        if(!response.ok) return;
        history.push("/chatrooms");
    }

    async function deleteGroup() {
        let response = await apiService.deleteGroup(roomId);
        if (!response.ok) return;
        history.push("/chatrooms");
    }

    async function removeMember(member)
    {
        if (!window.confirm(`Are you sure you want to remove ${member.profile.firstName} ${member.profile.lastName}?`)) return;
        await apiService.removeMember(roomId, member.id);
        fetchChatRoomDetails();
    }

    function getFilteredFriends(searchStr) {
        return friends.filter(friend => 
            matchingPrefixIgnoreCase(searchStr, friend.profile.firstName + " " + friend.profile.lastName));
    }

    function onFriendSelect(entry) {
        const friend = entry.friend;
        if (groupMembers.map(member => member.id).includes(friend.id)) return;
        apiService.inviteMember(roomId, friend.id);
    }

    return (
        <div className="d-flex justify-content-center align-items-center">
            <div style={{width: "500px"}} className="jam-form">
                <div className="container-fluid g-0">
                    <ErrorInputField 
                        value={groupName} 
                        onInput={groupAdmin === currentUser.id ? setGroupName : no_op} 
                        label="Group Name:" 
                        type="text" 
                        id="groupName"
                        isError={groupName.length === 0} 
                        message={"Chatroom name cannot be empty"}/>
                    <InputTextarea 
                        style={{height: "200px"}} 
                        value={groupDetails} 
                        onInput={groupAdmin === currentUser.id ? setGroupDetails : no_op} 
                        label="Group Details:" 
                        type="text"/>
                    {groupAdmin === currentUser.id &&
                        <button style={subButtonStyle} className="jam-submit-button" onClick={updateGroupDetails}>Save</button>}
                    {groupAdmin === currentUser.id 
                        ? <button style={subButtonStyle} className="jam-warning jam-submit-button" onClick={deleteGroup}>Delete Group</button>
                        : <button style={subButtonStyle} className="jam-warning jam-submit-button" onClick={leaveGroup}>Leave Group</button>}
                    <DropdownField 
                        value={friendSearch}
                        onInput={setFriendSearch}
                        label="Invite Friends:" 
                        type="text"
                        hasMore={false}
                        onSelect={onFriendSelect}
                        entries = {getFilteredFriends(friendSearch).map(friend => {return {
                            friend: friend, 
                            html: (<span>{friend.profile.firstName + " " + friend.profile.lastName}</span>)
                        }})}/>
                    <label className="jam-form-label">Group Members:</label>
                    <ul style={memberListStyle}>
                        {groupMembers.map(groupMember => (
                            <li className="member-entry" key={groupMember.id}>
                                {groupMember.profile.firstName + " " + groupMember.profile.lastName}
                                <FaIcons.FaInfoCircle onClick={() => viewProfile(groupMember.id)} className="icon-btn" style={infoIconStyle}/>
                                {groupAdmin === currentUser.id && groupMember.id != groupAdmin &&
                                    <FaIcons.FaRegTimesCircle onClick={() => removeMember(groupMember)} className="icon-btn" style={removeIconStyle}/>}
                                {/* {(groupAdmin === currentUser.id) && (groupMember.id != groupAdmin) && 
                                    <button className="edit-btn edit-btn1" onClick={() => removeMember(groupMember.id)}>Remove Member</button>} */}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default GroupDetails;