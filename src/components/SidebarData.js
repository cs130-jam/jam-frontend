import React from 'react';
import * as FaIcons from 'react-icons/fa';

const darkIcon = {
  color: "grey"
}

export const SidebarData = [
  {
    title: 'Suggestions',
    path: '/find-friend',
    icon: <FaIcons.FaCartPlus style={darkIcon}/>,
    cName: 'nav-text'
  },
  {
    title: 'Logout',
    path: '/logout',
    icon: <FaIcons.FaSignOutAlt style={darkIcon}/>,
    cName: 'nav-text'
  }
];