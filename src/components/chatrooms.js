import { useEffect, useRef, useState } from "react";
import * as FaIcons from 'react-icons/fa';
import { Link } from "react-router-dom";
import useInterval from "../util/useInterval";
import useStateRef from "../util/useStateRef";

const INITIAL_FETCH_COUNT = 10;
const FETCH_IDS_DELAY = 10000; // every 10 seconds

const roomsSectionStyle = {
    borderRight: "1px solid rgba(0, 0, 0, 0.07)",
    position: "relative",
    padding: "8px",
    marginLeft: "12px"
};

const roomsListStyle = {
    margin: "0px",
    padding: "8px",
    height: "calc(100% - 3.7rem)",
    listStyle: "none"
};

const roomsTitleStyle = {
    margin: "2em 0 0 0",
    padding: "4px",
    width: "100%",
    borderTop: "1px solid rgba(0, 0, 0, 0.07)"
};

const plusIcon = {
    color: "grey",
    float: "right"
};

const Chatrooms = (props) => {
    const apiService = props.apiService;
    const currentUser = props.currentUser;

    const [chatroomIds, setChatroomIds] = useState([]);
    const [chatroomMap, setChatroomMap, chatroomMapRef] = useStateRef({});
    const [loadedCount, setLoadedCount] = useState(INITIAL_FETCH_COUNT);
    const loadMoreRef = useRef();
    
    useInterval(fetchChatroomIds, FETCH_IDS_DELAY);
    useEffect(() => fetchChatroomIds(), [currentUser]);

    async function fetchChatroomIds() {
        if (currentUser.id === undefined) return;
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

        console.log(currentUser.id);
        console.log(json.members);
        let otherMemberIds = json.members.filter(id => id != currentUser.id);
        console.log(otherMemberIds);
        console.log("");

        let updatedMap = {...chatroomMapRef.current};
        updatedMap[roomId] = json;
        setChatroomMap(updatedMap);
    }

    return (
    <>
        <div className="col-6 col-lg-2 col-md-3 col-sm-4" style={roomsSectionStyle}>
            <h3 style={roomsTitleStyle}>
                Chatrooms 
                <Link to='/create-chatroom' style={plusIcon}>
                    <FaIcons.FaPlus />
                </Link>
            </h3>
            <ul style={roomsListStyle}>
                {chatroomIds.slice(0, loadedCount).map(roomId => 
                    chatroomMap[roomId] === undefined 
                    ? <li key={roomId}>Loading...</li>
                    : 
                        <li key={roomId}>
                            {chatroomMap[roomId].isDirectMessage ? "DIRECT" : "NOT DIRECT"}
                        </li>
                )}
                <li ref={loadMoreRef} key="LOAD MORE"></li>
            </ul>
        </div>
    </>
    );
}

export default Chatrooms;