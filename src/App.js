import './App.css';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, useHistory, Switch } from 'react-router-dom';
import Login from './components/login';
import Header from './components/header';
import Footer from './components/footer';
import SignUp from './components/signup';
import Navbar from './components/Navbar';
import AboutUs from './components/aboutUs';
import ContactUs from './components/contactUs';
import FindFriend from './components/findFriend';
import PrivacyPolicy from './components/privacyPolicy';
import useCookie from './util/useCookie';
import JamAPIService from './services/jamService';
import FileUpload from './util/imageUpload';
import ViewFriends from './components/viewFriends';
import Welcome from './components/welcome';
import Logout from './components/logout';
import Chatrooms from './components/chatrooms';
import UpdateProfile from './components/updateProfile';
import CreateChatroom from './components/createChatroom';
import Notifications from './components/notifications';
const SESSION_TOKEN_KEY = "session-token";

const contentStyle = {
    height: "calc(100vh - 107px - 118px)", // values determined from header and footer height
    position: "relative"
};

const notFoundStyle = {
    width: "100%",
    textAlign: "center",
    fontSize: "50pt",
    marginTop: "20px"
};

function App() {
    const history = useHistory();
    const [sessionToken, setSessionToken, removeSessionToken] = useCookie(SESSION_TOKEN_KEY);
    const [currentUser, setCurrentUser] = useState({});
    const apiService = new JamAPIService(sessionToken, removeSessionToken, history);

    useEffect(() => getCurrentUserId(), [sessionToken]);
    async function getCurrentUserId() {
        if (sessionToken === null || sessionToken.length === 0) {
            setCurrentUser({});
        } else {
            let response = await apiService.getCurrentUser();
            if (!response.ok) return;
            setCurrentUser(await response.json());
        }
    }

    return (
    <Router>
        <Header/>
        <div className="container-fluid g-0">
            <div style={contentStyle}>
                <Navbar sessionToken={sessionToken}/>
                <div className="row" style={contentStyle}>
                    {sessionToken != null && sessionToken.length > 0 
                    ? <Switch>
                        <Route exact path="/home">
                            <Welcome/>
                        </Route>
                        <Route exact path="/logout">
                            <Logout removeSessionToken={removeSessionToken}/>
                        </Route>
                        <Route exact path="/about-us">
                            <AboutUs/>
                        </Route>
                        <Route exact path="/privacy-policy">
                            <PrivacyPolicy/>
                        </Route>
                        <Route exact path="/contact-us">
                            <ContactUs/>
                        </Route>
                        <Route exact path="/test-upload">
                            <FileUpload 
                                postUpload={apiService.uploadPfp.bind(apiService)}
                                getAccepted={apiService.getSupportedPfpFormats.bind(apiService)}/>
                        </Route>
                        <Route exact path="/update-profile">
                            <UpdateProfile apiService = {apiService}/>
                        </Route>
                        <Route exact path="/find-friend">
                            <FindFriend apiService = {apiService}/>
                        </Route>
                        <Route exact path="/view-friends">
                            <ViewFriends apiService = {apiService}/>
                        </Route>
                        <Route 
                            exact path={["/chatrooms", "/chatrooms/:roomId"]}
                            render={(props) => <Chatrooms {...props} apiService={apiService} currentUser={currentUser} sessionToken={sessionToken}/>}
                        />
                        <Route exact path="/create-chatroom">
                            <CreateChatroom apiService={apiService}/>
                        </Route>
                        <Route exact path="/notifications">
                            <Notifications apiService={apiService}/>
                        </Route>
                        <Route>
                            <h1 style={notFoundStyle}>Page not found</h1>
                        </Route>
                    </Switch>
                    : <Switch>
                        <Route exact path="/login">
                            <Login setSessionToken={setSessionToken} apiService={apiService}/>
                        </Route>
                        <Route exact path="/sign-up">
                            <SignUp setSessionToken={setSessionToken} apiService={apiService}/>
                        </Route>
                        <Route>
                            <h1 style={notFoundStyle}>Page not found</h1>
                        </Route>
                    </Switch>
                    }
                </div>
            </div>
        </div>
        
        <Footer/>
    </Router>
    );
}

export default App;