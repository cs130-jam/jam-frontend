import React from "react";
import ReactDOM from "react-dom";
import { act, resolvingPromise } from "react-dom/test-utils";
import chai, {expect} from "chai";
var jsdom = require("mocha-jsdom");
import UpdateProfile from '../components/updateProfile';
import sinon from 'sinon';

global.document = jsdom({
  url: "http://localhost/"
});

let rootContainer;
var spy;
var assert = sinon.assert;

beforeEach(() => {
  component = renderComponent(UpdateProfile);
  rootContainer = document.createElement("div");
  document.body.appendChild(rootContainer);
  spy = sinon.spy(window.spyConfig.object, window.spyConfig.method);
});

afterEach(() => {
  document.body.removeChild(rootContainer);
  rootContainer = null;
  spy.restore();
});

describe("UpdateProfile Component Testing", () => {
 
  it('has the class d-flex justify-content-center align-items-center', () => {
    expect(component).to.have.class('d-flex justify-content-center align-items-center');
  });

  it('has the class jam-form', () => {
    expect(component).to.have.class('jam-form');
  });

  it('has the class jam-title-text', () => {
    expect(component).to.have.class('jam-title-text');
  });

  it('has the class container-fluid g-0', () => {
    expect(component).to.have.class('container-fluid g-0');
  });

  it('has the class row g-0', () => {
    expect(component).to.have.class('row g-0');
  });

  it('has the col-4', () => {
    expect(component).to.have.class('col-4');
  });

  it('has the class removable-list-entry', () => {
    expect(component).to.have.class('removable-list-entry');
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

  it("instrument selected", ()=>{
    const wrapper = shallow(<UpdateProfile />);
    wrapper.setState({ instruments: ["Piano"] });
    wrapper.onInstrumentSelect("Keys");
    chai.expect(wrapper.state().instruments).to.equal(["Piano", "Keys"]);
  });

  it("artist selected", ()=>{
    const wrapper = shallow(<UpdateProfile />);
    wrapper.setState({ artists: [{"name": "taylor swift", "path": "5678"}] });
    wrapper.onArtistSelect({"name": "selena gomez", "path": "1234"});
    chai.expect(wrapper.state().artists).to.equal([{"name": "taylor swift", "path": "5678"}, {"name": "selena gomez", "path": "1234"}]);
  });

  it("removed instrument", ()=>{
    const wrapper = shallow(<UpdateProfile />);
    wrapper.setState({ instruments: ["Piano", "Keys"] });
    wrapper.removeInstrument("Keys");
    chai.expect(wrapper.state().instruments).to.equal(["Piano"]);
  });

  it("removed artist", ()=>{
    const wrapper = shallow(<UpdateProfile />);
    wrapper.setState({ artists: [{"name": "taylor swift", "path": "5678"}, {"name": "selena gomez", "path": "1234"}] });
    wrapper.removeArtist({"name": "selena gomez", "path": "1234"});
    chai.expect(wrapper.state().artists).to.equal([{"name": "selena gomez", "path": "1234"}]);
  });

});