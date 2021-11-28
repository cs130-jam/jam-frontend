import React from "react";
import ReactDOM from "react-dom";
import { act, resolvingPromise } from "react-dom/test-utils";
import chai, {expect} from "chai";
var jsdom = require("mocha-jsdom");
import Footer from '../components/Footer';
import sinon from 'sinon';

global.document = jsdom({
  url: "http://localhost/"
});

let rootContainer;
var spy;
var assert = sinon.assert;

beforeEach(() => {
  rootContainer = document.createElement("div");
  document.body.appendChild(rootContainer);
  spy = sinon.spy(window.spyConfig.object, window.spyConfig.method);
});

afterEach(() => {
  document.body.removeChild(rootContainer);
  rootContainer = null;
  spy.restore();
});

describe("Footer Component Testing", () => {
  
 it("Renders About Us Footer Link", () => {
    act(() => {
      ReactDOM.render(<Footer />, rootContainer);
    });
    const links = rootContainer.querySelector("Link");
    const link1 = links[0];
    expect(link1.textContent).to.equal("About Us");
  });

  it("Renders Privacy Policy Footer Link", () => {
    act(() => {
      ReactDOM.render(<Footer />, rootContainer);
    });
    const links = rootContainer.querySelector("Link");
    const link2 = links[1];
    expect(link2.textContent).to.equal("Privacy Policy");
  });

  it("Renders Contact Us Footer Link", () => {
    act(() => {
      ReactDOM.render(<Footer />, rootContainer);
    });
    const links = rootContainer.querySelector("Link");
    const link2 = links[2];
    expect(link2.textContent).to.equal("Contact Us");
  });

  it("Clickable Footer Links",  function() {
    var links = $("p.Link"),
    linksCount = links.length;
    for(var i=0; i < linksCount ; i++){
        link = $(links[i].to);
        link.click();
        assert.called(spy);
    }
});
});