import { useEffect, useState } from "react";
import * as FaIcons from 'react-icons/fa';
import React from 'react';
import "./notifications.css";

const container = {
    margin: "24px auto",
    width: "800px",
    padding: "16px",
    border: "1px solid #c9c9c9",
    borderRadius: "5px",
    background: "#f5f5f5"
};

const listStyle = {
    width: "100%",
    listStyle: "none",
    marginTop: "20px",
    padding: "0px"
}

const notifStyle = {
    float: "right",
    marginTop: "8px"
}

const subtitle = {
    marginTop: "20px",
    color: "grey"
};

const Notifications = (props) => {
    const apiService = props.apiService;

    const [notifications, setNotifications] = useState([]);


    async function removeNotification(id) {
        let response = await apiService.remNotification(id);
        if (!response.ok) return;
        console.log("removeNotification");
        getNotifications();
    }

    async function rejectNotification(id) {
        let response = await apiService.rejNotification(id);
        if (!response.ok) return;
        console.log("rejectNotification");
        getNotifications();
    }
    async function acceptNotification(id) {
        let response = await apiService.accNotification(id);
        if (!response.ok) return;
        console.log("acceptNotification");
        getNotifications();
    }

    async function getNotifications() {
        let response = await apiService.getNotifications();
        if (!response.ok) return;
        setNotifications(await response.json());
    }
    useEffect(() => getNotifications(), []);

    return (<div style={container}>
        <h1>Notifications</h1>
        {notifications.length === 0 && <h3 style={subtitle}>No notifications.</h3>}
        <ul style = {listStyle}>
            {notifications.map(notification =>
                <li className="notification-entry"> 
                    {notification.title} 
                    <FaIcons.FaTrashAlt className="icon" onClick={() => removeNotification(notification.id)} style={notifStyle}/>
                    {notification.canReject && <FaIcons.FaRegTimesCircle className="icon" onClick={() => rejectNotification(notification.id)} style={notifStyle}/>} 
                    {notification.canAccept && <FaIcons.FaCheck className="icon" onClick={() => acceptNotification(notification.id)} style={notifStyle}/>}
                </li> 
            )}
        </ul>
    </div>);
};

export default Notifications;
//FaConciergeBell