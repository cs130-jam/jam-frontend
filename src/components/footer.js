import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, Link, RouteHandler} from 'react-router-dom';

const footerStyle = {
    margin: '15rem 0rem 0rem 0rem',
    padding: '1rem',
    //background: 'rgb(235, 195, 64)',
    position: 'fixed',
    bottom: '0',
    left: '0',
    width: '100%'
};

const lineStyle1 = {
    color: '#000000',
    border: '5px',
    opacity: '5'
};

const lineStyle2 = {
    color: '#000000',
    border: '5px',
    opacity: '5',
    margin: '50px 0 0 0'
};

const linkStyle = {
    color: 'black'
  };


const footerLinkStyle = {
    color: 'green'
};



// Usage example:

const Footer = () => {
    return (
        <div style={footerStyle}>
            <hr  style={lineStyle1} />
        <p style={footerLinkStyle}>  <Link style={linkStyle} to="/about-us">About Us</Link>  |  <Link style={linkStyle} to="/privacy-policy">Privacy Policy</Link>  |  <Link style={linkStyle} to="/contact-us">Contact Us</Link></p>
        <hr  style={lineStyle2} />
      </div>
    );
};

export default Footer;