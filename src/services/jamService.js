const API_BASE_URL = "http://localhost/api/";

const API_CALL_URL = (...path) => API_BASE_URL + path.join("/");
const API_QUERY_PARAMS = (url, params) => url + "?" + new URLSearchParams(params);
const SESSION_TOKEN_KEY = "session-token";

class JamAPIService {
    constructor(sessionToken, removeSessionToken, history) {
        this.removeSessionToken = removeSessionToken;
        this.sessionToken = sessionToken;
        this.history = history;
    }

    getUser(userId){
        return fetch(API_CALL_URL("user", userId),{
            headers: {
                "Accept": "application/json"
            }
        });
    }

    getCurrentUser() {
        return this.apiRequest(API_CALL_URL("user"), {
            headers: {
                "Accept": "application/json"
            }
        });
    }

    getCurrentUserChatroom(userId){
        return this.apiRequest(API_CALL_URL("user", userId, "chatroom"), {
            headers: {
                "Accept": "application/json"
            }
        });
    }

    rejectMatch(userId){
        return this.apiRequest(API_CALL_URL("match","reject"), {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({"userId":userId})
           
        })
    }

    remNotification(userId) {
        return this.apiRequest(API_CALL_URL("notifications",userId,"remove"), {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },           
        })
    }

    rejNotification(userId) {
        return this.apiRequest(API_CALL_URL("notifications",userId,"reject"), {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },           
        })
    }

    accNotification(userId) {
        return this.apiRequest(API_CALL_URL("notifications",userId,"accept"), {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },           
        })
    }

    acceptMatch(userId){
        return this.apiRequest(API_CALL_URL("match","accept"), {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({"userId":userId})
           
        })
    }

    friend(userId) {
        return this.apiRequest(API_CALL_URL("friends", userId), {
            method: "PUT",
            headers: {"Accept": "application/json"}
        });
    }

    unFriend(userId) {
        return this.apiRequest(API_CALL_URL("friends",userId), {
            method: "DELETE",
            headers: {"Accept": "application/json"}
        });
    }

    getRec(){
        return this.apiRequest(API_CALL_URL("match"), {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        });

    }

    login(data) {
        return fetch(API_CALL_URL("internal", "login"), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(data)
        });
    }

    signup(data) {
        return fetch(API_CALL_URL("internal", "signup"), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(data)
        });
    }

    updateProfile(data) {
        return this.apiRequest(API_CALL_URL("user", "profile"), {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
    }

    updatePreferences(data) {
        return this.apiRequest(API_CALL_URL("user", "preferences"), {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
    }

    existingUser(username) {
        return fetch(API_QUERY_PARAMS(API_CALL_URL("internal", "user"), {
            "username": username
        }));
    }

    getInstruments() {
        return fetch(API_CALL_URL("user", "choices", "instruments"));
    }

    findArtists(query, page) {
        return fetch(API_QUERY_PARAMS(API_CALL_URL("artist", "search"), {
            "artist": query,
            "page": page
        }),
        {
            method: "GET",
            headers: {
                "Accept": "application/json"
            },
        });
    }

    getTypes(){
        return this.apiRequest(API_CALL_URL("music","types"), {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        });
    }

    getSupportedPfpFormats() {
        return fetch(API_CALL_URL("upload", "supported"));
    }

    uploadPfp(pfpForm) {
        return this.apiRequest(API_CALL_URL("upload"), {
            method: "POST",
            body: pfpForm
        })
    }

    getChatroomIds() {
        return this.apiRequest(API_CALL_URL("chatrooms"), {
            headers: {
                "Accept": "application/json"
            }
        });
    }

    getChatroom(roomId) {
        return this.apiRequest(API_CALL_URL("chatroom", roomId), {
            headers: {
                "Accept": "application/json"
            }
        });
    }

    leaveGroup(roomId) {
        return this.apiRequest(API_CALL_URL("chatroom", roomId, "leave"), {
            method: "POST",
            headers: 
            {
                "Accept": "application/json"
            }
        });
    }

    deleteGroup(roomId) {
        return this.apiRequest(API_CALL_URL("chatroom", roomId), {
            method: "DELETE",
            headers: {"Accept": "application/json"}
        });
    }

    inviteMember(roomId, userId) {
        return this.apiRequest(API_CALL_URL("chatroom", roomId, "invite", userId), {
            method: "PUT"
        })
    }

    removeMember(roomId, userId) {
        return this.apiRequest(API_CALL_URL("chatroom", roomId, "members", userId), {
            method: "DELETE"
        });
    }
    
    createChatroom(roomData) {
        return this.apiRequest(API_CALL_URL("chatroom"), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(roomData)
        });
    }

    getChatsByCount(roomId, count) {
        return this.apiRequest(
            API_QUERY_PARAMS(
                API_CALL_URL("chatroom", roomId, "recent"), 
                {"count": count}
            ),
            {headers: {"Accept": "application/json"}}
        );
    }

    getChatsByTime(roomId, time) {
        return this.apiRequest(
            API_QUERY_PARAMS(
                API_CALL_URL("chatroom", roomId, "after"), 
                {"time": time}
            ),
            {headers: {"Accept": "application/json"}}
        );
    }

    sendChat(roomId, message) {
        return this.apiRequest(
            API_CALL_URL("chatroom", roomId),
            {
                method: "POST",
                headers: {"Content-Type": "text/plain"},
                body: message
            }
        );
    }

    getFriendIds() {
        return this.apiRequest(API_CALL_URL("friends"), {
            headers: {"Accept": "application/json"}
        });
    }

    getNotifications() {
        return this.apiRequest(API_CALL_URL("notifications"), {
            headers: {"Accept": "application/json"}
        });
    }


    test() {
        return fetch(API_CALL_URL("test", "user", "random"), {
            method: "GET",
            headers: {
                "Accept": "application/json"
            },
        });
    }    

    getChatRoomDetails(roomId) {
        return this.apiRequest(API_CALL_URL("chatroom", roomId), {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        });
    }

    setChatRoomDetails(roomId, info) {
        return this.apiRequest(API_CALL_URL("chatroom", roomId, "info"), {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(info)
        })
    }

    apiRequest(url, info) {
        const headersWithToken = "headers" in info ? info.headers : {};
        headersWithToken[SESSION_TOKEN_KEY] = this.sessionToken;
        info.headers = headersWithToken;

        return fetch(url, info).then(res => {
            if (res.status === 401) {
                this.removeSessionToken();
                this.history.push("/login");
            }
            return res;
        });
    }
}

export default JamAPIService;
