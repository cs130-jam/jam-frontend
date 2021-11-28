import { useEffect, useState } from "react";
import * as FaIcons from 'react-icons/fa';
import React from 'react';
import "./notifications.css";

const listStyle = {
    margin: "0 auto",
    width: "800px",
    listStyle: "none",
    marginTop: "40px"
}

const notifStyle = {
    float: "right",
    marginTop: "8px"
}


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

    return (<ul style = {listStyle}>
        {notifications.map(notification =>
            <li> 
                <div className="notification-entry">{notification.title} 
                    <button onClick={acceptNotification(notification.id)}> <FaIcons.FaCheck style={notifStyle}/> </button> 
                    <button onClick={rejectNotification(notification.id)}> <FaIcons.FaRegTimesCircle style={notifStyle} /> </button> 
                    <button onClick={removeNotification(notification.id)}> <FaIcons.FaTrashAlt style={notifStyle}/> </button>
                </div>
                </li> 
        )}
    </ul>
    );
};

export default Notifications;
//FaConciergeBell