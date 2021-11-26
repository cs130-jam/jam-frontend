import { useEffect, useState } from "react";
import * as FaIcons from 'react-icons/fa';
import DropdownField from "../util/dropdownField";
import ErrorInputField from "../util/errorInputField";
import { useHistory } from "react-router";

function matchingPrefixIgnoreCase(prefix, entry) {
    const compareLength = Math.min(prefix.length, entry.length);
    return prefix.substring(0, compareLength).toLowerCase() === entry.substring(0, compareLength).toLowerCase();
}

const friendsListStyle = {
    margin: "0px",
    padding: "0px",
    listStyleType: "none"
}

const CreateChatroom = (props) => {
    const apiService = props.apiService;
    
    const history = useHistory();
    const [groupName, setGroupName] = useState("");
    const [friends, setFriends] = useState([]);
    const [selectedFriends, setSelectedFriends] = useState([]);
    const [friendSearch, setFriendSearch] = useState("");

    async function fetchFriends() {
        let response = await apiService.getFriendIds();
        if (!response.ok) return;
        let friendIds = await response.json();

        let friendsResponses = await Promise.all(friendIds.map(id => apiService.getUser(id)));
        let friends = await Promise.all(friendsResponses.map(resp => resp.json()));
        setFriends(friends);
    }
    useEffect(() => fetchFriends(), []);

    function onFriendSelect(entry) {
        const friend = entry.friend;
        if (selectedFriends.map(f => f.id).includes(friend.id)) return;
        setSelectedFriends([...selectedFriends, friend]);
    }

    function getFilteredFriends(searchStr) {
        return friends.filter(friend => 
            matchingPrefixIgnoreCase(searchStr, friend.profile.firstName + " " + friend.profile.lastName));
    }

    function removeFriend(friend) {
        setSelectedFriends(selectedFriends
            .filter(selectedFriend => selectedFriend.id != friend.id));
    }

    async function createGroup() {
        if (groupName.length === 0) return;
        if (selectedFriends.length === 0) return;
        let response = await apiService.createChatroom({
            "info": {
                "name": groupName
            },
            "members": selectedFriends.map(friend => friend.id)
        });
        if (!response.ok) return;
        history.push("/chatrooms");
    }

    return (
        <div className="d-flex justify-content-center align-items-center">
            <div className="jam-form">
                <div className="container-fluid g-0">
                    <p className="jam-title-text">Create Chatroom</p>
                    <ErrorInputField 
                        value={groupName} 
                        onInput={setGroupName}
                        label="Chatroom name: " 
                        type="text" 
                        isError={groupName.length === 0} 
                        message={"Chatroom name cannot be empty"}/>
                    <DropdownField 
                        value={friendSearch}
                        onInput={setFriendSearch}
                        label="Add Friends:" 
                        type="text"
                        hasMore={false}
                        onSelect={onFriendSelect}
                        entries = {getFilteredFriends(friendSearch).map(friend => {return {
                            friend: friend, 
                            html: (<span>{friend.profile.firstName + " " + friend.profile.lastName}</span>)
                        }})}/>
                    <ul style={friendsListStyle}>
                        {selectedFriends.map(friend => (
                            <li className="removable-list-entry" key={friend.id}>
                                <span>{friend.profile.firstName + " " + friend.profile.lastName}</span>
                                <FaIcons.FaTimes className="remove-icon" onClick={e => removeFriend(friend)}>x</FaIcons.FaTimes>
                            </li>
                        ))}
                    </ul>
                    <div className="row g-0">
                        <div className="col">
                            <button className="jam-submit-button" onClick={createGroup}>Create Chatroom</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateChatroom;