import React from "react";
import ReactDOM from "react-dom";
import { act, resolvingPromise } from "react-dom/test-utils";
import chai, {expect} from "chai";
var jsdom = require("mocha-jsdom");
import Welcome from '../components/welcome';

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

describe("Welcome Component Testing", () => {
  
 it("Renders the Welcome's heading", () => {
    act(() => {
      ReactDOM.render(<Welcome />, rootContainer);
    });
    const h1 = rootContainer.querySelector("h1");
    expect(h1.textContent).to.equal("Welcome to JAM!");
  });

});