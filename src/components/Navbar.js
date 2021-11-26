import React, { useState } from 'react';
import * as FaIcons from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { SidebarData } from './SidebarData';
import './Navbar.css';
import { IconContext } from 'react-icons';

const darkIcon = {
    color: "grey"
}

function Navbar(props) {
    const sessionToken = props.sessionToken;
    const [sidebar, setSidebar] = useState(false);
    const toggleSidebar = () => setSidebar(!sidebar);
    
    return (sessionToken !== null && sessionToken.length > 0 &&
    <>
        <IconContext.Provider value={{ color: 'rgb(48, 133, 214)' }}>
            <Link to='#' className='nav-icon'>
                <FaIcons.FaBars onClick={toggleSidebar}/>
            </Link>
        </IconContext.Provider>
        <IconContext.Provider value={{ color: '#FFF' }}>
            <div className={'col-2 nav-menu ' + (sidebar ? 'active' : '')}>
                <ul className='nav-menu-items'>
                    {SidebarData.map((item, index) => 
                        <li key={index} className="nav-text" onClick={toggleSidebar}>
                            <Link to={item.path}>
                                {item.icon}
                                <span>{item.title}</span>
                            </Link>
                        </li>
                    )}
                </ul>
            </div>
        </IconContext.Provider>
    </>
    );
}

export default Navbar;