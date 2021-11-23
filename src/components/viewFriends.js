import React, {useState, useRef,useEffect} from 'react';
import ReactDOM from 'react-dom';
import '../App.css';


const button={
    cursor: 'pointer',
    border: '1px solid #1a202c',
    padding: '8px',
    width: '100px',

    background: 'rgb(48, 133, 214)',

    transition: 'all 0.1s ease-in',
    
    
  borderRadius: '5px',
  margin: '10px 10px'

  }


 const textalign =  {
    textAlign: "center",
  }

  const StyledTable = {
    
    margin: "auto"
  
  }

  const nameStyle = {
    color: "black",
    fontSize:"100px",
    margin: '0px',
    fontFamily: "lato"
  };

  const bioStyle = {
    color: "black",
    fontSize:"40px",
    fontStyle:"italic",
    fontFamily: "lato"
  };

  const jobStyle = {
    color: "black",
    fontSize:"30px",
    
    fontFamily: "lato"
  };



  function ViewFriends(props) {
    
    console.log(props.someprop[0])


    

    return (
        <div className="container">
            <h3 className="p-3 text-center">Your Friends</h3>
            <table className="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th>{props.someprop[0]}</th>
                        <th>Email</th>
                        <th>Role</th>
                    </tr>
                </thead>
                <tbody>
                    
                                           </tbody>
                                       </table>
                                   </div>
                               );
                           }
                           
                           export default ViewFriends;