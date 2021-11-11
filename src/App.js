import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Login from './components/login';
import Header from './components/header';
import Footer from './components/footer';
import SignUp from './components/signup';
import Navbar from './components/Navbar';
import AboutUs from './components/aboutUs';
import ContactUs from './components/contactUs';
import PrivacyPolicy from './components/privacyPolicy';
import useCookie from './util/useCookie';
import { useRef } from 'react';
import JamAPIService from './services/jamService';

const SESSION_TOKEN_KEY = "session-token";

const contentStyle = {
    height: "calc(100% - 106px - 118px)" // values determined from header and footer height
};

const fullHeight = {
    height: "100vh",
    width: "100vw",
    padding: "0px",
    margin: "0px"
}

function App() {
    const [sessionToken, setSessionToken, removeSessionToken] = useCookie(SESSION_TOKEN_KEY);
    const apiService = useRef(new JamAPIService(sessionToken, removeSessionToken));

    return (
        <div className="container-fluid g-0" style={fullHeight}>
            <Header className="row"/>
            <BrowserRouter>
                <div className="row" style={contentStyle}>
                    <Switch>
                        <Route path="/login">
                            <Login setSessionToken={setSessionToken} apiService={apiService}/>
                        </Route>
                        <Route path="/sign-up">
                            <SignUp />
                        </Route>
                        <Route path="/about-us">
                            <AboutUs />
                        </Route>
                        <Route path="/privacy-policy">
                            <PrivacyPolicy />
                        </Route>
                        <Route path="/contact-us">
                            <ContactUs />
                        </Route>
                    </Switch>
                </div>
                <Footer className="row"/>
            </BrowserRouter>
        </div>
    );
}

export default App;
