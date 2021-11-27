import { useEffect, useState } from "react";

const Notifications = (props) => {
    const apiService = props.apiService;

    const [notifications, setNotifications] = useState([]);

    async function getNotifications() {
        let response = await apiService.getNotifications();
        if (!response.ok) return;
        setNotifications(await response.json());
    }
    useEffect(() => getNotifications(), []);

    return (<>
        {notifications.map(notification =>
            <div>{notification.title}</div> 
        )}
    </>
    );
};

export default Notifications;