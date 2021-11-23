import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';

export const SidebarData = [
  {
    title: 'Login',
    path: '/login',
    icon: <AiIcons.AiFillHome />,
    cName: 'nav-text'
  },
  {
    title: 'Sign-Up',
    path: '/sign-up',
    icon: <IoIcons.IoIosPaper />,
    cName: 'nav-text'
  },
  {
    title: 'Find-Friend',
    path: '/find-friend',
    icon: <FaIcons.FaCartPlus />,
    cName: 'nav-text'
  }
];