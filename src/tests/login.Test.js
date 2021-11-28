import React from "react";
import ReactDOM from "react-dom";
import { act, resolvingPromise } from "react-dom/test-utils";
import chai, {expect} from "chai";
var jsdom = require("mocha-jsdom");
import Login from '../components/login';
import sinon from 'sinon';

global.document = jsdom({
  url: "http://localhost/"
});

let rootContainer;
var spy;
var assert = sinon.assert;

beforeEach(() => {
  component = renderComponent(Login);
  rootContainer = document.createElement("div");
  document.body.appendChild(rootContainer);
  spy = sinon.spy(window.spyConfig.object, window.spyConfig.method);
});

afterEach(() => {
  document.body.removeChild(rootContainer);
  rootContainer = null;
  spy.restore();
});

describe("Login Component Testing", () => {
 
  it('has the class d-flex justify-content-center align-items-center', () => {
    expect(component).to.have.class('d-flex justify-content-center align-items-center');
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