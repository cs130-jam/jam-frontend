import './App.css';
import React, {useState, useRef} from 'react';
import { BrowserRouter as Router, Route, Switch, useLocation } from 'react-router-dom';
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
//import { useRef } from 'react';
import JamAPIService from './services/jamService';
<<<<<<< HEAD
//import { useLocation } from 'react-router-dom'
//import SideNavPage from './components/sideNavBar';
import {withRouter} from 'react-router-dom';
=======
import FileUpload from './util/imageUpload';
>>>>>>> 1753da33e2cbe21aa1164487b632faa867c9f455

const SESSION_TOKEN_KEY = "session-token";

const contentStyle = {
    minHeight: "calc(100vh - 106px - 118px)" // values determined from header and footer height
};

const findFindStyle = {
    justifyContent: 'centre',
    alignItems: 'centre'
};

//const SomeComponent = withRouter(props => <App {...props}/>);

function App() {
    const [sessionToken, setSessionToken, removeSessionToken] = useCookie(SESSION_TOKEN_KEY);
    const apiService = useRef(new JamAPIService(sessionToken, removeSessionToken));
    const [isInvalid, setIsInvalid] = useState(false);
    const pathname = window.location.pathname;
    //console.log(pathname);
    //const location = useLocation();
    //console.log(location);
    //const {pathname} = this.props.location;
    /*if(pathname !== '/login')
     {
         setIsInvalid(true);
     }*/
    // setIsInvalid(true);

    return (
        /*<>
      <Router>
        <Navbar />
        <Switch>
          <Route path='/login' exact component={Login} />
          <Route path='/sign-up' component={SignUp} />
          <Route path='/find-friend' component={FindFriend} />
        </Switch>
      </Router>
    </>*/
 
        <div >
           <Header />
          <div className="container-fluid g-0">
        
            

            <Router>
            <Navbar />
                <div className="row" style={contentStyle}>
                
                    <Switch>
                        <Route path="/login">
                            <Login setSessionToken={setSessionToken} apiService={apiService}/>
                        </Route>
                        <Route path="/sign-up">
                            <SignUp setSessionToken={setSessionToken} apiService={apiService}/>
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
<<<<<<< HEAD
                    
                        <Route path="/find-friend">
                            <FindFriend />
=======
                        <Route path="/test-upload">
                            <FileUpload 
                                postUpload={apiService.current.uploadPfp.bind(apiService.current)}
                                getAccepted={apiService.current.getSupportedPfpFormats.bind(apiService.current)}/>
                        </Route>
                        <Route path="/findfriend" >

                            <FindFriend apiService = {apiService}/>
>>>>>>> 1753da33e2cbe21aa1164487b632faa867c9f455
                        </Route>
                    </Switch>
                </div>
                </Router>
              
                </div>
                <Router>
  
                <div>
                <Footer />
                </div>
            </Router>
        </div>
    );
}

export default App;
