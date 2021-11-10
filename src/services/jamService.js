const API_BASE_URL = "http://localhost:8080/";

// import { apiUrl } from './util/request';
// import useCookie from './util/useCookie';

// const SESSION_TOKEN_KEY = "session-token";
// const WEBSOCKET_URL = "ws://localhost:8080/api/ws/jam";

// function App() {
//     const [sessionToken, setSessionToken, removeSessionToken] = useCookie(SESSION_TOKEN_KEY);
//     let ws = useRef(null);

//     function fetchWithToken(url, info) {
//         const headersWithToken = "headers" in info ? info.headers : {};
//         headersWithToken[SESSION_TOKEN_KEY] = sessionToken;
//         info.headers = headersWithToken;

//         return fetch(url, info).then(res => {
//             if (res.ok) {
//                 return res;
//             } else {
//                 if (res.status === 401) removeSessionToken();
//                 return Promise.reject(res);
//             }
//         });
//     }

//     function makeWebsocket(sessionToken) {
//         const ws = new WebSocket(WEBSOCKET_URL);
//         ws.onopen = () => {
//             ws.send(sessionToken);
//         }
//         ws.onmessage = message => console.log(message);
//         ws.onerror = console.error;
    
//         return ws;
//     }

class jamService{
    login(data){
        return fetch(API_BASE_URL+"api/login/internal", {
            method: "POST",
            body: data
        });
    }

}
export default new jamService();