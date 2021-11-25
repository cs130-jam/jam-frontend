import React from 'react';
import * as FaIcons from 'react-icons/fa';

const darkIcon = {
  color: "grey"
}

export const SidebarData = [
  {
    title: 'Update Profile',
    path: '/update-profile',
    icon: <FaIcons.FaHandPaper style={darkIcon}/>,
    cName: 'nav-text'
  },
  {
    title: 'Suggestions',
    path: '/find-friend',
    icon: <FaIcons.FaHandPaper style={darkIcon}/>,
    cName: 'nav-text'
  },
  {
    title: 'Chatrooms',
    path: '/chatrooms',
    icon: <FaIcons.FaCommentAlt style={darkIcon}/>,
    cName: 'nav-text'
  },
  {
    title: 'Logout',
    path: '/logout',
    icon: <FaIcons.FaSignOutAlt style={darkIcon}/>,
    cName: 'nav-text'
  }
];