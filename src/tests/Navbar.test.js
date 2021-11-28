import React from "react";
import ReactDOM from "react-dom";
import { act, resolvingPromise } from "react-dom/test-utils";
import chai, {expect} from "chai";
var jsdom = require("mocha-jsdom");
import Navbar from '../components/Navbar';
import sinon from 'sinon';

global.document = jsdom({
  url: "http://localhost/"
});

let rootContainer;
var spy;
var assert = sinon.assert;

beforeEach(() => {
  component = renderComponent(Navbar);
  rootContainer = document.createElement("div");
  document.body.appendChild(rootContainer);
  spy = sinon.spy(window.spyConfig.object, window.spyConfig.method);
});

afterEach(() => {
  document.body.removeChild(rootContainer);
  rootContainer = null;
  spy.restore();
});

describe("Navbar Component Testing", () => {
  
 it("Check for the icons in Navbar", () => {
    act(() => {
      ReactDOM.render(<Footer />, rootContainer);
    });
    expect($('IconContext.Provider').length > 1).to.be.true;
  });

  it("Check for FaBars icons in Navbar", () => {
    act(() => {
      ReactDOM.render(<Footer />, rootContainer);
    });
    expect($('FaIcons.FaBars').length === 1).to.be.true;
  });

  it('has the class nav-icon', () => {
    expect(component).to.have.class('nav-icon');
  });

  it('has the class nav-menu-items', () => {
    expect(component).to.have.class('nav-menu-items');
  });

  it('has the class nav-text', () => {
    expect(component).to.have.class('nav-text');
  });

  it("Clickable Links on the Side Nav Bar",  function() {
    var links = $("li.Link"),
    linksCount = links.length;
    for(var i=0; i < linksCount ; i++){
        link = $(links[i].to);
        link.click();
        assert.called(spy);
    }
});
});