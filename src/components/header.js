import React from 'react';

const headerStyle = {
    padding: '21px 35px',
    height: "106px",
    background: '#3085d6',
    color: 'white'
};

const headerSize = {
    fontSize: "3.2rem"
}

const Header = () => {
    return (
      <div style={headerStyle}>
          <h1 style={headerSize}>JAM</h1> 
      </div>
    );
};

export default Header;