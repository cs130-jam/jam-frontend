import { useEffect, useRef, useState } from "react";
import * as FaIcons from 'react-icons/fa';
import { Link } from "react-router-dom";
import useInterval from "../util/useInterval";
import useStateRef from "../util/useStateRef";
import useOnScreen from "../util/useOnScreen";
import Chats from "./chats";
import { useHistory } from "react-router";

const INITIAL_FETCH_COUNT = 15;
const FETCH_IDS_DELAY = 30000; // every 30 seconds
const LOAD_MORE_DELAY = 1000; // 1 second
const WEBSOCKET_RETRY_DELAY = 10000; // every 10 seconds
const CHAT_REFRESH_TIME = 10000; // 10 seconds
const RECENT_CHATS_COUNT = 100;
const WEBSOCKET_URL = "ws://localhost:8080/api/ws/jam";

const roomsSectionStyle = {
    borderRight: "1px solid rgba(0, 0, 0, 0.07)",
    padding: "8px",
    paddingLeft: "12px",
    marginLeft: "8px",
    minWidth: "240px",
    height: "100%",
    backgroundColor: "#f2f7fc"
};

const chatroomInfoStyle = {
    backgroundColor: "#f2f7fc",
    minWidth: "240px",
    height: "100%",
    borderLeft: "1px solid rgba(0, 0, 0, 0.07)",
    padding: "15px"
}

const roomsListStyle = {
    margin: "0px",
    padding: "8px",
    height: "calc(100% - 100px)",
    overflow: "auto",
    listStyle: "none"
};

const roomsTitleStyle = {
    margin: "2em 0 0 0",
    padding: "6px",
    paddingTop: "12px",
    width: "100%",
    borderTop: "1px solid rgba(0, 0, 0, 0.07)"
};

const plusIcon = {
    color: "grey",
    float: "right",
    marginTop: "-2px"
};

const detailsTitleStyle = {
    width: "100%",
    padding: "17px 0px",
    marginLeft: "-3px",
    borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
    wordWrap: "break-word"
};

const infoIconStyle = {
    fontSize: "20pt",
    float: "right",
    marginRight: "12px",
    marginTop: "-8px"
};

const Chatrooms = (props) => {
    const apiService = props.apiService;
    const currentUser = props.currentUser;
    const sessionToken = props.sessionToken;
    const history = useHistory();

    const [chatroomIds, setChatroomIds] = useState([]);
    const [chatroomMap, setChatroomMap, chatroomMapRef] = useStateRef({});
    const [loadedCount, setLoadedCount] = useState(INITIAL_FETCH_COUNT);

    const loadMoreRef = useRef();
    const needMore = useOnScreen(loadMoreRef);

    const websocket = useRef(null);
    const [chatsMap, setChatsMap, chatMapsRef] = useStateRef({});
    const [selectedChatroom, setSelectedChatroom] = useState(props.match.params.roomId ? props.match.params.roomId : "");
    
    useInterval(fetchChatroomIds, FETCH_IDS_DELAY);
    useEffect(() => fetchChatroomIds(), [currentUser]);
    useInterval(() => {
        if (loadedCount < chatroomIds.length && needMore) {
            setLoadedCount(loadedCount + INITIAL_FETCH_COUNT);
        }
    }, LOAD_MORE_DELAY)
    useInterval(() => {
        if (selectedChatroom.length === 0) return;
        updateChatroom(selectedChatroom);
    }, CHAT_REFRESH_TIME);

    async function fetchChatroomIds() {
        if (currentUser.id === undefined) return;
        
        let response = await apiService.getChatroomIds();
        if (!response.ok) return;
        let ids = await response.json();
        setChatroomIds(ids);
        ids.slice(0, loadedCount).forEach(load);
    }

    async function load(roomId) {
        let response = await apiService.getChatroom(roomId);
        if (!response.ok) return;
        let json = await response.json();

        let otherMemberResponses = await Promise.all(json.members
            .filter(id => id != currentUser.id)
            .map(userId => apiService.getUser(userId)));
        let otherMembers = await Promise.all(otherMemberResponses
            .filter(response => response.ok)
            .map(response => response.json()));
        json.otherMembers = otherMembers;

        let updatedMap = {...chatroomMapRef.current};
        updatedMap[roomId] = json;
        setChatroomMap(updatedMap);
    }

    async function updateChatroom(roomId) {
        if (roomId.length === 0) return;
        const chats = chatMapsRef.current[roomId] || [];

        let response;
        if (chats.length > 0) {
            response = await apiService.getChatsByTime(roomId, chats[chats.length-1].at);
        } else {
            response = await apiService.getChatsByCount(roomId, RECENT_CHATS_COUNT);
        }

        if (!response.ok) return;
        let newChats = await response.json();
        if (newChats.length === 0 && chatMapsRef.current[roomId] !== undefined) return;

        let newChatMaps = {...chatMapsRef.current};
        newChatMaps[roomId] = chats.concat(newChats.reverse());
        setChatsMap(newChatMaps);

        response = await apiService.getChatroomIds();
        if (!response.ok) return;
        let ids = await response.json();
        setChatroomIds(ids);
    }
    useEffect(() => updateChatroom(selectedChatroom), [selectedChatroom]);

    function ensureOpenWebsocket() {
        if (sessionToken === null || sessionToken.length === 0) return;
        if (websocket.current !== null && websocket.current.readyState !== WebSocket.CLOSED) return;

        let ws = new WebSocket(WEBSOCKET_URL);
        ws.onopen = () => {
            ws.send(sessionToken);
        }
        ws.onmessage = (message) => {
            updateChatroom(message.data);
        }
        ws.onerror = (error) => console.error(error);
        websocket.current = ws;
    }
    useInterval(ensureOpenWebsocket, WEBSOCKET_RETRY_DELAY);
    useEffect(ensureOpenWebsocket, []);

    function isLoaded(roomId) {
        return !(chatroomMap[roomId] === undefined 
            || (chatroomMap[roomId].directMessage && !chatroomMap[roomId].otherMembers)
            || (chatroomMap[roomId].directMessage && chatroomMap[roomId].otherMembers.length === 0));
    }

    return (
    <>
        <div className="col-2" style={roomsSectionStyle}>
            <h3 style={roomsTitleStyle}>
                Chatrooms 
                <Link to='/create-chatroom' style={plusIcon}>
                    <FaIcons.FaPlus/>
                </Link>
            </h3>
            <ul style={roomsListStyle}>
                {chatroomIds.slice(0, loadedCount).map(roomId => 
                    <li key={roomId} 
                        className={"chatroom-entry " + (selectedChatroom === roomId ? "active" : "")}
                        onClick={() => setSelectedChatroom(roomId)}>
                        <span>{!isLoaded(roomId)
                            ? "Loading..."
                            : (chatroomMap[roomId].directMessage
                                ? chatroomMap[roomId].otherMembers[0].profile.firstName + " " + chatroomMap[roomId].otherMembers[0].profile.lastName
                                : chatroomMap[roomId].info.name)}
                        </span>
                    </li>
                )}
                <li ref={loadMoreRef} key="LOAD MORE"></li>
            </ul>
        </div>
        <div className="col">
            {selectedChatroom.length > 0 && <Chats
                roomId={selectedChatroom}
                chatsMap={chatsMap}
                chatroomMap={chatroomMap}
                updateChats={updateChatroom}
                apiService={apiService}
                currentUser={currentUser}
            />}
        </div>
        <div className="col-2" style={chatroomInfoStyle}>
            {chatroomMap[selectedChatroom] && <>
                <h2 style={detailsTitleStyle}>
                    {chatroomMap[selectedChatroom].directMessage 
                    ? chatroomMap[selectedChatroom].otherMembers[0].profile.firstName + " " + chatroomMap[selectedChatroom].otherMembers[0].profile.lastName
                    : chatroomMap[selectedChatroom].info.name}
                </h2>
                <div>
                    {!chatroomMap[selectedChatroom].directMessage &&
                        <Link to={`/chatrooms/${selectedChatroom}/details`} style={infoIconStyle}>
                            <FaIcons.FaInfoCircle/>
                        </Link>
                    }
                    <h4>Members:</h4>
                    {[currentUser, ...chatroomMap[selectedChatroom].otherMembers].map(user => 
                        <Link key={user.id} to={`/user/${user.id}`} className="chatroom-member-entry">
                            {user.profile.firstName + " " + user.profile.lastName}
                        </Link>
                    )}
                </div>
            </>}
        </div>
    </>
    );
}

export default Chatrooms;