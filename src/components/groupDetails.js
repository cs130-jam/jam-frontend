import React, {useState, useRef, useEffect} from 'react';
import '../App.css';
import InputField from '../util/inputField';
import InputTextarea from '../util/inputTextarea';
import DropdownField from '../util/dropdownField';
import { useHistory } from "react-router";

function matchingPrefixIgnoreCase(prefix, entry) {
    const compareLength = Math.min(prefix.length, entry.length);
    return prefix.substring(0, compareLength).toLowerCase() === entry.substring(0, compareLength).toLowerCase();
}

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

    function inviteMember(userId)
    {
        apiService.inviteMember(roomId, userId);
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

    async function removeMember(userId)
    {
        await apiService.removeMember(roomId, userId);
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

    //Display the page/extra things to view on page
    const page = (
        <div className="container-fluid g-0">
            <InputField value={groupName} onInput={setGroupName} label="Group Name:" type="text" id="groupName"/>
            <InputTextarea style={{height: "200px"}} value={groupDetails} onInput={setGroupDetails} label="Group Details:" type="text" id="groupDetail"/>
            <center><button className="edit-btn edit-btn1" onClick={updateGroupDetails}>Save</button></center>
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
            <center>
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
                {(groupAdmin != currentUser.id) && <button className="edit-btn edit-btn1" onClick={leaveGroup}>Leave Group</button>}
                {currentUser.id === groupAdmin && <button className="edit-btn edit-btn1" onClick={deleteGroup}>Delete Group</button>}
            </center>
            <center>
                Group Members:
                <ul>
                    {groupMembers.map(groupMember => (
                        <li className="member-entry" key={groupMember.id}>
                            <span>{groupMember.profile.firstName + " " + groupMember.profile.lastName}</span>
                            <button className="edit-btn edit-btn1" onClick={() => viewProfile(groupMember.id)}>View Profile</button>
                            {(groupAdmin === currentUser.id) && (groupMember.id != groupAdmin) && 
                                <button className="edit-btn edit-btn1" onClick={() => removeMember(groupMember.id)}>Remove Member</button>}
                        </li>
                            ))}
                </ul>
            </center>
        </div>
        </div>
    );
};

export default GroupDetails;