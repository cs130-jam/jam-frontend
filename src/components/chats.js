import './chats.css';
import { useEffect, useRef, useState } from "react";

const containerStyle = {
    position: "relative",
    width: "100%",
    height: "100%"
}

const Chats = (props) => {
    const roomId = props.roomId;
    const chatsMap = props.chatsMap;
    const chatroomMap = props.chatroomMap;
    const updateChats = props.updateChats;
    const apiService = props.apiService;
    const currentUser = props.currentUser;

    const [message, setMessage] = useState("");
    const bottomRef = useRef();

    async function sendMessage(message) {
        if (message.length === 0) return;
        
        setMessage("");
        const response = await apiService.sendChat(roomId, message);
        if (!response.ok) return;
        updateChats(roomId);
    }

    function getUsername(userId) {
        if (currentUser.id === userId) {
            return currentUser.profile.firstName;
        } else {
            if (!chatroomMap[roomId].otherMembers) return "Unknown";
            const matchingUsers = chatroomMap[roomId].otherMembers.filter(member => member.id === userId);
            if (matchingUsers.length === 0) {
                return "Unknown";
            } else {
                return matchingUsers[0].profile.firstName;
            }
        }        
    }

    useEffect(() => {
        bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }, [chatsMap, roomId]);

    return (
    <div style={containerStyle}>
        <div id="chat">
            <ul>
                {chatroomMap[roomId] && chatsMap[roomId] && chatsMap[roomId].map(chat => 
                    <li key={chat.id}>
                        <div 
                            className={"message-item " + (currentUser.id === chat.senderId ? "sent" : "received")}
                            key={chat.id}
                        >
                            <div className="username">{getUsername(chat.senderId)}</div>
                            <div className="message-body">{chat.message}</div>
                        </div> 
                    </li>
                )}
                <li key="bottom" ref={bottomRef}></li>
            </ul>
        </div>
        <div id="interface">
            <input type="text" id="message" name="Message" value={message} 
                onInput={e => setMessage(e.target.value)}
                onKeyPress={e => {if (e.key === "Enter") sendMessage(message)}}/>
            <button className="jam-submit-button" onClick={() => sendMessage(message)}>Send</button>
        </div>
    </div>
    );
}

export default Chats;