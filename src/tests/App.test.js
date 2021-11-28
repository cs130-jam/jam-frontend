import React from "react";
import ReactDOM from "react-dom";
import { act, resolvingPromise } from "react-dom/test-utils";
import chai, {expect} from "chai";
var jsdom = require("mocha-jsdom");
import { render, unmountComponentAtNode } from "react-dom";
import { MemoryRouter } from "react-router-dom";
import AppContent from "../AppContent";
import Login from './components/login';
import Header from './components/header';
import Footer from './components/footer';
import SignUp from './components/signup';
import Navbar from './components/Navbar';
import AboutUs from './components/aboutUs';
import ContactUs from './components/contactUs';
import FindFriend from './components/findFriend';
import PrivacyPolicy from './components/privacyPolicy';
import ViewFriends from './components/viewFriends';
import Welcome from './components/welcome';
import Logout from './components/logout';
import Chatrooms from './components/chatrooms';
import UpdateProfile from './components/updateProfile';
import CreateChatroom from './components/createChatroom';

global.document = jsdom({
  url: "http://localhost/"
});



let rootContainer;

beforeEach(() => {
  rootContainer = document.createElement("div");
  document.body.appendChild(rootContainer);
});

afterEach(() => {
  document.body.removeChild(rootContainer);
  rootContainer = null;
});

describe("AppContent Component Testing", () => {
  
 /* it("adds 1 and 2", ()=>{
    chai.expect(sum(1,2)).to.equal(3);
  });*/  
  
  it('has the class container-fluid g-0', () => {
    expect(component).to.have.class('container-fluid g-0');
  });

  it('has the class row', () => {
    expect(component).to.have.class('row');
  });

  it('Render login in component', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    expect(location.pathname).toBe("/login");
  });

  it('Render sign up component', () => {
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );
    expect(location.pathname).toBe("/sign-up");
  });

  it('Render about us component', () => {
    render(
      <MemoryRouter>
        <AboutUs />
      </MemoryRouter>
    );
    expect(location.pathname).toBe("/about-us");
  });

  it('Render contact us component', () => {
    render(
      <MemoryRouter>
        <ContactUs />
      </MemoryRouter>
    );
    expect(location.pathname).toBe("/contact-us");
  });

  it('Render sign up component', () => {
    render(
      <MemoryRouter>
        <PrivacyPolicy />
      </MemoryRouter>
    );
    expect(location.pathname).toBe("/privacy-policy");
  });

  it('Render find friend component', () => {
    render(
      <MemoryRouter>
        <FindFriend />
      </MemoryRouter>
    );
    expect(location.pathname).toBe("/find-friend");
  });

  it('Render view friends component', () => {
    render(
      <MemoryRouter>
        <ViewFriends/>
      </MemoryRouter>
    );
    expect(location.pathname).toBe("/view-friends");
  });

  it('Render view update profile component', () => {
    render(
      <MemoryRouter>
        <UpdateProfile/>
      </MemoryRouter>
    );
    expect(location.pathname).toBe("/update-profile");
  });

  it('Render view welcome component', () => {
    render(
      <MemoryRouter>
        <Welcome/>
      </MemoryRouter>
    );
    expect(location.pathname).toBe("/home");
  });

  it('Render view createChatroom component', () => {
    render(
      <MemoryRouter>
        <CreateChatroom/>
      </MemoryRouter>
    );
    expect(location.pathname).toBe("/create-chatroom");
  });

  it('Render view chatrooms component', () => {
    render(
      <MemoryRouter>
        <Chatrooms/>
      </MemoryRouter>
    );
    expect(location.pathname).toBe("/chatrooms/:roomId");
  });

});