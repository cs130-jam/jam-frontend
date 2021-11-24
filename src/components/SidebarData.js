import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';

const darkIcon = {
  color: "grey"
}

export const SidebarData = [
  {
    title: 'Login',
    path: '/login',
    icon: <AiIcons.AiFillHome style={darkIcon}/>,
    cName: 'nav-text'
  },
  {
    title: 'Sign-Up',
    path: '/sign-up',
    icon: <IoIcons.IoIosPaper style={darkIcon}/>,
    cName: 'nav-text'
  },
  {
    title: 'Find-Friend',
    path: '/find-friend',
    icon: <FaIcons.FaCartPlus style={darkIcon}/>,
    cName: 'nav-text'
  }
];