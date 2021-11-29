import React from 'react';
import ReactDOM from 'react-dom';

const aboutStyle = {

  text: "center",
  fontSize: "20pt"
}
const AboutUs = () => {
    return (
      <div className="d-flex justify-content-center align-items-center">
      <div style={aboutStyle}>
  <h1>About Us</h1>
  <br/>
  <p> At JAM, be believe there is a better way to play music with like mided people.</p>
  <p> Our mission is to collobarate people with similar interests.</p>
  <p>Sign up with JAM, meet new people, make friends and play music together!</p>
 

<p>JAM, Just for you!</p>
</div>
  </div>
    );
};

export default AboutUs;