import React from 'react';
import { render } from 'react-dom';
import { Wave1, Wave2, Random1, Random2 } from './examples.js';

const styles = {
  fontFamily: 'Lato',
  textAlign: 'center',
  margin: 'auto'
};

function Welcome(){ 
return (
  <div style={styles}>
    <h1>Welcome to JAM!</h1>
    
    <Wave1 />

   

    
  </div>
);

}
export default Welcome;