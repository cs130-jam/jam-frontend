import { useEffect, useRef, useState } from "react";
import * as FaIcons from 'react-icons/fa';
import { Link } from "react-router-dom";
import useInterval from "../util/useInterval";
import useStateRef from "../util/useStateRef";
import useOnScreen from "../util/useOnScreen";

const INITIAL_FETCH_COUNT = 3;
const FETCH_IDS_DELAY = 1000; // every 10 seconds

const roomsSectionStyle = {
    borderRight: "1px solid rgba(0, 0, 0, 0.07)",
    position: "relative",
    padding: "8px",
    marginLeft: "12px",
    minWidth: "240px",
    height: "100%"
};

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

const Chatrooms = (props) => {
    const apiService = props.apiService;
    const currentUser = props.currentUser;

    const [chatroomIds, setChatroomIds] = useState([]);
    const [chatroomMap, setChatroomMap, chatroomMapRef] = useStateRef({});
    const [loadedCount, setLoadedCount] = useState(INITIAL_FETCH_COUNT);
    const loadMoreRef = useRef();
    const needMore = useOnScreen(loadMoreRef)
    
    useInterval(fetchChatroomIds, FETCH_IDS_DELAY);
    useEffect(() => fetchChatroomIds(), [currentUser]);

    async function fetchChatroomIds() {
        if (currentUser.id === undefined) return;
        if (loadedCount < chatroomIds.length && needMore) {
            setLoadedCount(loadedCount + INITIAL_FETCH_COUNT);
        }
        let response = await apiService.getChatroomIds();
        if (!response.ok) return;
        let ids = await response.json();
        setChatroomIds(ids);
        ids.slice(0, loadedCount).forEach(ensure);
    }

    async function ensure(roomId) {
        if (chatroomMapRef.current[roomId] !== undefined) return; 
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
        console.log(updatedMap);
    }

    return (
    <>
        <div className="col-2" style={roomsSectionStyle}>
            <h3 style={roomsTitleStyle}>
                Chatrooms 
                <Link to='/create-chatroom' style={plusIcon}>
                    <FaIcons.FaPlus />
                </Link>
            </h3>
            <ul style={roomsListStyle}>
                {chatroomIds.slice(0, loadedCount).map(roomId => 
                    <li key={roomId} className="chatroom-entry">
                        <span>{chatroomMap[roomId] === undefined || (chatroomMap[roomId].directMessage && chatroomMap[roomId].otherMembers.length === 0)
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
    </>
    );
}

export default Chatrooms;