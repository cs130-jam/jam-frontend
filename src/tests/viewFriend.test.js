import React from "react";
import ReactDOM from "react-dom";
import { act, resolvingPromise } from "react-dom/test-utils";
import chai, {expect} from "chai";
var jsdom = require("mocha-jsdom");
import ViewFriends from '../components/viewFriends';
import sinon from 'sinon';

global.document = jsdom({
  url: "http://localhost/"
});

let rootContainer;
var spy;
var assert = sinon.assert;

beforeEach(() => {
  component = renderComponent(ViewFriends);
  rootContainer = document.createElement("div");
  document.body.appendChild(rootContainer);
  spy = sinon.spy(window.spyConfig.object, window.spyConfig.method);
});

afterEach(() => {
  document.body.removeChild(rootContainer);
  rootContainer = null;
  spy.restore();
});

describe("ViewFriends Component Testing", () => {
 
  it('has the class container', () => {
    expect(component).to.have.class('container');
  });

  it('has the class p-3 text-center', () => {
    expect(component).to.have.class('p-3 text-center');
  });

  it('has the class table table-striped table-bordered', () => {
    expect(component).to.have.class('table table-striped table-bordered');
  });


});