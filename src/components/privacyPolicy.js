import React from 'react';
import ReactDOM from 'react-dom';

const aboutStyle = {

  text: "center",
  fontSize: "20pt"
}

const PrivacyPolicy = () => {
  return (
    <div className="d-flex justify-content-center align-items-center">
    <div style={aboutStyle}>
<h1>Privacy Policy</h1>
<br/>
<p> Welcome to JAM’s Privacy Policy. Thank you for taking the time to read it.</p>
<p> We notify you of the following:</p>


<ol>
<li><b>Information We Collect</b>
<p>We collect the information given by you when you sign up or update your profile and your location.</p></li>
<li><b>How We Use Information</b>
<p>We use your information to help you connect with other users and improve our serices.</p>
</li>
<li><b>How We Share Information</b></li>
<p>Since our goal is to help you make meaningful connections, the main sharing of members’ information is, of course, with other members.</p>
</ol>
</div>
</div>
  );
};

export default PrivacyPolicy;