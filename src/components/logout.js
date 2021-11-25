import { useEffect } from "react";
import { useHistory } from "react-router-dom";

const Logout = (props) => {
    const history = useHistory();
    const removeSessionToken = props.removeSessionToken;
    useEffect(() => {
        removeSessionToken();
        history.push("/login");
    }, []);
    return false;
}

export default Logout;