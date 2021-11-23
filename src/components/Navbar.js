import React, { useState } from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { SidebarData } from './SidebarData';
import './Navbar.css';
import { IconContext } from 'react-icons';

function Navbar() {
  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);
  const pathname = window.location.pathname;
  let ind = pathname==='/login' ? 0 : 1;
  console.log(pathname);
  console.log(ind);
  const [pageIndex, setPageIndex] = useState(ind);
  const pages = [
    (
       <>
         </>
    ),
    (
      <>
<IconContext.Provider value={{ color: 'rgb(48, 133, 214)' }}>
        <div className='navbar'>
          <Link to='#' className='menu-bars'>
            <FaIcons.FaBars onClick={showSidebar} />
          </Link>
        </div>
        </IconContext.Provider>
        <IconContext.Provider value={{ color: '#FFF' }}>
        <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
          <ul className='nav-menu-items' onClick={showSidebar}>
            <li className='navbar-toggle'>
              <Link to='#' className='menu-bars'>
                <AiIcons.AiOutlineClose />
              </Link>
         
            </li>
            <br/>
            {SidebarData.map((item, index) => {
              return (
                <li key={index} className={item.cName}>
                  <Link to={item.path}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </IconContext.Provider>
      </>
    )
    
];

  return (
    <>
    {pages[pageIndex]}
      
    </>
  );
}

export default Navbar;