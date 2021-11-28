import React from "react";
import ReactDOM from "react-dom";
import { act, resolvingPromise } from "react-dom/test-utils";
import chai, {expect} from "chai";
var jsdom = require("mocha-jsdom");
import JamAPIService from '../services/jamService';
import sinon from 'sinon';

global.document = jsdom({
  url: "http://localhost/"
});

let rootContainer;
var spy;
var assert = sinon.assert;

beforeEach(() => {
  
});

afterEach(() => {

});

describe("Jam Services Testing", () => {

    it("Login success", done => {

        const input = {
            "username": "User1",
            "password": "password"
        };
        let response = await JamAPIService.login(input);
        expect(response.status).to.equal(200);
        done();
	});

    it("Login unauthorized", done => {

        const input = {
            "username": "invaliduser",
            "password": "invalidpassword"
        };
        let response = await JamAPIService.login(input);
        expect(response.status).to.equal(401);
        done();
	});

    it("Login success case", done => {

        const input = {
            "username": String,
            "password": String
        };
        let response = await JamAPIService.login(loginData);
        expect(response.status).to.equal(200);
        done();
	});

    it("Signup success", done => {

        const input = {
            "username": "testuser",
            "password": "testpassowrd",
            "firstName": "user1",
            "lastName": "user2",
            "location": {
                "latitude": "",
                "longitude": ""
             },
             "musicInterests": [
                 {
                     "name": "selena gomez", 
                     "path": "path/12380" 
                 }
            ],
            "instruments": List["piano"],
        }
        let response = await JamAPIService.signup(input);
        expect(response.status).to.equal(200);
        done();
	});

    it("Signup user exists", done => {

        const input = {
            "username": "User1",
            "password": "passowrd",
            "firstName": "user1",
            "lastName": "user2",
            "location": {
                "latitude": "",
                "longitude": ""
             },
             "musicInterests": [
                 {
                     "name": "selena gomez", 
                     "path": "path/12380" 
                 }
            ],
            "instruments": List["piano"],
        }
        let response = await JamAPIService.signup(input);
        expect(response.status).to.equal(409);
        done();
	});

    it("User Profile success", done => {
        const logininput = {
            "username": "User1",
            "password": "password"
        };
        let loginresponse = await JamAPIService.login(logininput);
        
        JamAPIService.sessionToken = loginresponse.token;
        const input = {
            "firstName": "test name",
            "lastName": "",
            "location": {
                "latitude": "",
                "longitude": ""
            },
            "bio": "test bio",
            "instruments": List[String]
        
    };
        let response = await JamAPIService.updateProfile(input);
        expect(response.status).to.equal(204);
        done();
	});

    it("User Preferences success", done => {
        const logininput = {
            "username": "User1",
            "password": "password"
        };
        let loginresponse = await JamAPIService.login(logininput);
        
        JamAPIService.sessionToken = loginresponse.token;
        const input = {
            "maxDistance": {
                "value": 100,
                "units": "1000"
            },
            "wantedInstruments": List["piano"]
        };
        let response = await JamAPIService.updatePreferences(input);
        expect(response.status).to.equal(204);
        done();
	});

    it("user exists", done => {

        let response = await JamAPIService.existingUser("User1");
        expect(response.status).to.equal(204);
        done();
	});

    it("user does not exist", done => {

        let response = await JamAPIService.existingUser("invalid");
        expect(response.status).to.equal(409);
        done();
	});

    it("find artists", done => {

        let response = await JamAPIService.findArtists();
        expect(response.status).to.equal(200);
        done();
	});

    
    it("get instruments", done => {

        let response = await JamAPIService.getInstruments();
        expect(response.status).to.equal(200);
        done();
	});
        
    it("get types", done => {

        const logininput = {
            "username": "User1",
            "password": "password"
        };
        let loginresponse = await JamAPIService.login(logininput);
        
        JamAPIService.sessionToken = loginresponse.token;
        let response = await JamAPIService.getTypes();
        expect(response.status).to.equal(200);
        done();
	});

    it("get supported formats", done => {
        
        let response = await JamAPIService.getSupportedPfpFormats();
        expect(response.status).to.equal(200);
        done();
	});

    it("get chatroom Ids", done => {

        const logininput = {
            "username": "User1",
            "password": "password"
        };
        let loginresponse = await JamAPIService.login(logininput);
        
        JamAPIService.sessionToken = loginresponse.token;
        let response = await JamAPIService.getChatroomIds();
        expect(response.status).to.equal(200);
        done();
	});

    it("get Chatroom", done => {

        const logininput = {
            "username": "User1",
            "password": "password"
        };
        let loginresponse = await JamAPIService.login(logininput);
        
        JamAPIService.sessionToken = loginresponse.token;
        let response = await JamAPIService.getChatroom();
        expect(response.status).to.equal(200);
        done();
	});

    it("create chatroom", done => {

        const logininput = {
            "username": "User1",
            "password": "password"
        };
        let loginresponse = await JamAPIService.login(logininput);
        
        JamAPIService.sessionToken = loginresponse.token;

        let response = await JamAPIService.createChatroom("100");
        expect(response.status).to.equal(200);
        done();
	});

    it("get chats by count", done => {

        const logininput = {
            "username": "User1",
            "password": "password"
        };
        let loginresponse = await JamAPIService.login(logininput);
        
        JamAPIService.sessionToken = loginresponse.token;

        let response = await JamAPIService.getChatsByCount("100", 4);
        expect(response.status).to.equal(200);
        done();
	});

    it("get chats by time", done => {

        const logininput = {
            "username": "User1",
            "password": "password"
        };
        let loginresponse = await JamAPIService.login(logininput);
        
        JamAPIService.sessionToken = loginresponse.token;

        let response = await JamAPIService.getChatsByTime("100", 78009879);
        expect(response.status).to.equal(200);
        done();
	});

    
    it("send chat", done => {

        const logininput = {
            "username": "User1",
            "password": "password"
        };
        let loginresponse = await JamAPIService.login(logininput);
        
        JamAPIService.sessionToken = loginresponse.token;

        let response = await JamAPIService.sendChat("100", "hi all");
        expect(response.status).to.equal(200);
        done();
	});

    it("get friend IDs", done => {

        const logininput = {
            "username": "User1",
            "password": "password"
        };
        let loginresponse = await JamAPIService.login(logininput);
        
        JamAPIService.sessionToken = loginresponse.token;

        let response = await JamAPIService.getFriendIds();
        expect(response.status).to.equal(200);
        done();
	});

    it("get user", done => {

        const logininput = {
            "username": "User1",
            "password": "password"
        };
        let loginresponse = await JamAPIService.login(logininput);
        
        JamAPIService.sessionToken = loginresponse.token;

        let response = await JamAPIService.getUser(123765);
        expect(response.status).to.equal(200);
        done();
	});

    
    it("get current user", done => {

        const logininput = {
            "username": "User1",
            "password": "password"
        };
        let loginresponse = await JamAPIService.login(logininput);
        
        JamAPIService.sessionToken = loginresponse.token;

        let response = await JamAPIService.getCurrentUser();
        expect(response.status).to.equal(200);
        done();
	});

    it("get Current User Chatroom", done => {

        const logininput = {
            "username": "User1",
            "password": "password"
        };
        let loginresponse = await JamAPIService.login(logininput);
        
        JamAPIService.sessionToken = loginresponse.token;

        let response = await JamAPIService.getCurrentUserChatroom(123765);
        expect(response.status).to.equal(200);
        done();
	});

    it("reject Match", done => {

        const logininput = {
            "username": "User1",
            "password": "password"
        };
        let loginresponse = await JamAPIService.login(logininput);
        
        JamAPIService.sessionToken = loginresponse.token;

        let response = await JamAPIService.rejectMatch(123765);
        expect(response.status).to.equal(200);
        done();
	});

    it("accept Match", done => {

        const logininput = {
            "username": "User1",
            "password": "password"
        };
        let loginresponse = await JamAPIService.login(logininput);
        
        JamAPIService.sessionToken = loginresponse.token;

        let response = await JamAPIService.acceptMatch(123765);
        expect(response.status).to.equal(200);
        done();
	});

    it("unFriend", done => {

        const logininput = {
            "username": "User1",
            "password": "password"
        };
        let loginresponse = await JamAPIService.login(logininput);
        
        JamAPIService.sessionToken = loginresponse.token;

        let response = await JamAPIService.unFriend(123765);
        expect(response.status).to.equal(200);
        done();
	});

    
    it("get Recommendations", done => {

        const logininput = {
            "username": "User1",
            "password": "password"
        };
        let loginresponse = await JamAPIService.login(logininput);
        
        JamAPIService.sessionToken = loginresponse.token;

        let response = await JamAPIService.getRec();
        expect(response.status).to.equal(200);
        done();
	});

  it('has the class jam-form', () => {
    expect(component).to.have.class('jam-form');
  });

  it('has the class jam-title-text', () => {
    expect(component).to.have.class('jam-title-text');
  });

  it('has the class jam-submit-button', () => {
    expect(component).to.have.class('jam-submit-button');
  });

  it("Redirects to Signup Component", () => {
    act(() => {
        const signupLink = document.querySelector($(Link));
        signupLink.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      });
      expect(location.pathname).toBe("/sign-up");
  });

  it("set username", ()=>{
    const wrapper = shallow(<Login />);
    wrapper.onUsername("testuser");
    chai.expect(wrapper.state().username).to.equal("testuser");
  });

  it("set password", ()=>{
    const wrapper = shallow(<Login />);
    wrapper.onPassword("testpassword");
    chai.expect(wrapper.state().password).to.equal("testpassword");
  });

});