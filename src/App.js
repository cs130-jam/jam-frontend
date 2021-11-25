import './App.css';
import React, { useRef} from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
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
const SESSION_TOKEN_KEY = "session-token";

const contentStyle = {
    minHeight: "calc(100vh - 106px - 118px)", // values determined from header and footer height
    position: "relative"
};

function App() {
    const [sessionToken, setSessionToken, removeSessionToken] = useCookie(SESSION_TOKEN_KEY);
    const apiService = useRef(new JamAPIService(sessionToken, removeSessionToken));
    var myArray = ['something','hello'];
    
    return (
    <Router>
        <Header/>
        <div className="container-fluid g-0">
            <div style={contentStyle}>
                <Navbar sessionToken={sessionToken}/>
                <div className="row" style={contentStyle}>
                    {sessionToken != null && sessionToken.length > 0 
                    ? <>
                        <Route path="/home">
                            <Welcome/>
                        </Route>
                        <Route path="/logout">
                            <Logout removeSessionToken={removeSessionToken}/>
                        </Route>
                        <Route path="/about-us">
                            <AboutUs />
                        </Route>
                        <Route path="/privacy-policy">
                            <PrivacyPolicy/>
                        </Route>
                        <Route path="/contact-us">
                            <ContactUs/>
                        </Route>
                        <Route path="/test-upload">
                            <FileUpload 
                                postUpload={apiService.current.uploadPfp.bind(apiService.current)}
                                getAccepted={apiService.current.getSupportedPfpFormats.bind(apiService.current)}/>
                        </Route>
                        <Route path="/find-friend">
                            <FindFriend apiService = {apiService}/>
                        </Route>
                        <Route path="/viewfriends">
                            <ViewFriends someprop = {myArray}/>
                        </Route>
                    </>
                    : <>
                        <Route path="/login">
                            <Login setSessionToken={setSessionToken} apiService={apiService}/>
                        </Route>
                        <Route path="/sign-up">
                            <SignUp setSessionToken={setSessionToken} apiService={apiService}/>
                        </Route>
                    </>
                    }
                </div>
            </div>
        </div>
        
        <Footer/>
    </Router>
    );
}

export default App;