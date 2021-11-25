import React from 'react';
import * as FaIcons from 'react-icons/fa';

const darkIcon = {
  color: "grey"
}

export const SidebarData = [
  {
    title: 'Update Profile',
    path: '/update-profile',
    icon: <FaIcons.FaUserEdit style={darkIcon}/>,
  },
  {
    title: 'Suggestions',
    path: '/find-friend',
    icon: <FaIcons.FaHandPaper style={darkIcon}/>,
  },
  {
    title: 'Chatrooms',
    path: '/chatrooms',
    icon: <FaIcons.FaCommentAlt style={darkIcon}/>
  },
  {
    title: 'Logout',
    path: '/logout',
    icon: <FaIcons.FaSignOutAlt style={darkIcon}/>
  }
];