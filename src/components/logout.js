import { useEffect } from "react";
import { useHistory } from "react-router-dom";

const Logout = (props) => {
    const removeSessionToken = props.removeSessionToken;
    const history = useHistory();
    useEffect(() => {
        removeSessionToken();
        history.push("/login");
    }, []);
    return false;
}

export default Logout;