import React from "react";
import ReactDOM from "react-dom";
import { act, resolvingPromise } from "react-dom/test-utils";
import chai, {expect} from "chai";
var jsdom = require("mocha-jsdom");
import Header from '../components/Header';

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

describe("Header Component Testing", () => {
  
 it("Renders the Header's heading", () => {
    act(() => {
      ReactDOM.render(<Header />, rootContainer);
    });
    const h1 = rootContainer.querySelector("h1");
    expect(h1.textContent).to.equal("JAM");
  });

});