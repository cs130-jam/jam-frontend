import { useRef } from 'react';
import './App.css';
import { apiUrl } from './util/request';
import useCookie from './util/useCookie';

const SESSION_TOKEN_KEY = "session-token";
const WEBSOCKET_URL = "ws://localhost:8080/api/ws/jam";

function App() {
    const [sessionToken, setSessionToken, removeSessionToken] = useCookie(SESSION_TOKEN_KEY);
    let ws = useRef(null);

    function fetchWithToken(url, info) {
        const headersWithToken = "headers" in info ? info.headers : {};
        headersWithToken[SESSION_TOKEN_KEY] = sessionToken;
        info.headers = headersWithToken;

        return fetch(url, info).then(res => {
            if (res.ok) {
                return res;
            } else {
                if (res.status === 401) removeSessionToken();
                return Promise.reject(res);
            }
        });
    }

    function makeWebsocket(sessionToken) {
        const ws = new WebSocket(WEBSOCKET_URL);
        ws.onopen = () => {
            ws.send(sessionToken);
        }
        ws.onmessage = message => console.log(message);
        ws.onerror = console.error;
    
        return ws;
    }

    async function test() {
        let tokenResponse = await fetch(apiUrl("test", "user", "random"));
        let tokenJson = await tokenResponse.json();
        setSessionToken(tokenJson.token);
        ws.current = makeWebsocket(tokenJson.token);
    }

    async function causePing() {
        if (ws.current == null || ws.current.readyState === WebSocket.CLOSED) {
            ws.current = makeWebsocket(sessionToken);
        }
        let response = await fetchWithToken(apiUrl("test", "ws", "ping"), {
            method: "POST"
        });
        if (!response.ok) console.error(response);
    }
    
    return (
        <div className="App">
            <button onClick={test}>Test</button>
            <button onClick={(e) => causePing()}>Ping</button>
        </div>
    );
}

export default App;
