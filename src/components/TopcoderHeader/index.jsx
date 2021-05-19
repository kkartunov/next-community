import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import PT from 'prop-types';
import dynamic from 'next/dynamic'
// import Logo from 'assets/images/tc-logo.svg';
// import { tracking } from '../../actions';

import defaultTheme from './style.module.scss';

const HEADER_AUTH_URLS = {
  href: 'https://accounts-auth0.topcoder-dev.com?utm_source=community-app-main',
  location: 'https://accounts-auth0.topcoder-dev.com?retUrl=%S&utm_source=community-app-main',
};

const CDN = {
  PUBLIC: 'https://d1aahxkjiobka8.cloudfront.net',
};

const ACCOUNT_MENU_SWITCH_TEXT = {
  title: 'Switch to BUSINESS',
  href: 'https://connect.topcoder-dev.com',
};

const ACCOUNT_MENU = [
  {
    title: 'Settings',
    href: '/settings/profile',
  },
  { separator: true },
  {
    title: 'Help',
    href: 'https://community-app.topcoder-dev.com/thrive/tracks?track=Topcoder&tax=Help%20Articles',
  },
  { separator: true },
  {
    title: 'Log Out',
    href: 'https://www.topcoder-dev.com/logout',
  },
];

const HEADER_MENU = [
  {
    id: 'business',
    title: 'BUSINESS',
    href: 'https://www.topcoder-dev.com',
  },
  {
    id: 'community', // required for 'Switch to BUSINESS' to work
    title: 'COMMUNITY',
    secondaryMenu: [
      {
        title: 'Dashboard',
        href: '/my-dashboard',
        logged: true,
      },
      {
        id: 'myprofile',
        title: 'My Profile',
        href: '/members/willFilledByUserName',
        logged: true,
      },
      {
        title: 'Payments',
        href: 'https://community.topcoder-dev.com/PactsMemberServlet?module=PaymentHistory&full_list=false',
        logged: true,
        openNewTab: true,
      },
      {
        title: 'Overview',
        href: '/community/learn',
        logged: false,
      },
      {
        title: 'How It Works',
        href: '/thrive/tracks?track=Topcoder',
        logged: false,
      },
    ],
    subMenu: [
      {
        title: 'Compete',
        subMenu: [
          {
            title: 'All Challenges',
            href: '/challenges',
          },
          {
            title: 'Competitive Programming',
            href: '/community/arena',
          },
          {
            title: 'Gig Work',
            href: '/gigs',
          },
          {
            title: 'Practice',
            href: '/community/practice',
          },
        ],
      },
      {
        title: 'Tracks',
        subMenu: [
          {
            title: 'Competitive Programming',
            href: '/thrive/tracks?track=Competitive%20Programming',
          },
          {
            title: 'Data Science',
            href: '/thrive/tracks?track=Data%20Science&tax=',
          },
          {
            title: 'Design',
            href: '/thrive/tracks?track=Design&tax=',
          },
          {
            title: 'Development',
            href: '/thrive/tracks?track=Development&tax=',
          },
          {
            title: 'QA',
            href: '/thrive/tracks?track=QA&tax=',
          },
        ],
      },
      {
        title: 'Explore',
        subMenu: [
          {
            title: 'TCO',
            href: '/community/member-programs/topcoder-open',
          },
          {
            title: 'Programs',
            href: '/community/member-programs',
          },
          {
            title: 'Forums',
            href: 'https://vanilla.topcoder-dev.com',
          },
          {
            title: 'Statistics',
            href: '/community/statistics',
          },
          {
            title: 'Blog',
            href: 'https://www.topcoder-dev.com/blog',
            openNewTab: true,
          },
          {
            title: 'Thrive',
            href: '/thrive',
          },
        ],
      },
    ],
  },
];

// let TopNavRef;
// let LoginNavRef;

// try {
//   // eslint-disable-next-line global-require
//   const { TopNav, LoginNav } = require('navigation-component');
//   TopNavRef = TopNav;
//   LoginNavRef = LoginNav;
// } catch (e) {
//   // window is undefined
//   console.log('error catch', e)
// }

const TopNavRef = dynamic(
  () => import('navigation-component').then((mod) => mod.TopNav),
  { ssr: false }
);
const LoginNavRef = dynamic(
  () => import('navigation-component').then((mod) => mod.LoginNav),
  { ssr: false }
);

const Header = ({
  profile, auth, notifications, loadNotifications, markNotificationAsRead,
  markAllNotificationAsRead, markAllNotificationAsSeen, dismissChallengeNotifications, headerMenu,
}) => {
  const [activeLevel1Id, setActiveLevel1Id] = useState();
  const [path, setPath] = useState();
  const [openMore, setOpenMore] = useState(true);

  const handleChangeLevel1Id = (menuId) => {
    setActiveLevel1Id(menuId);
  };

  const handleCloseOpenMore = () => {
    setOpenMore(false);
  };

  const handleChangeOpenMore = (changedOpenMore) => {
    setOpenMore(changedOpenMore);
  };

  const handleSwitchMenu = () => {
    setActiveLevel1Id(HEADER_MENU[0].id);
  };

  let normalizedProfile = profile && _.clone(profile);
  if (profile) {
    normalizedProfile.photoURL = (_.has(profile, 'photoURL') && profile.photoURL !== null)
      ? `${CDN.PUBLIC}/avatar/${encodeURIComponent(profile.photoURL)}?size=32` : '';
  } else {
    normalizedProfile = null;
  }

  useEffect(() => {
    setPath(window.location.pathname + window.location.search);
  }, []);

  /*
  * Load Notifications and Init Google Analytics
  */
  useEffect(() => {
    // if (auth) {
    //   if (auth.tokenV3) {
    //     loadNotifications(auth.tokenV3);
    //   }
    //   if (auth.user) {
    //     tracking.init(auth.user.handle);
    //   }
    // }
  }, []);

  if (TopNavRef) {
    return (
      <div styleName={defaultTheme['nav-header-wrapper']}>
        <TopNavRef
          menu={headerMenu || HEADER_MENU}
          rightMenu={(
            <LoginNavRef
              loggedIn={!_.isEmpty(profile)}
              notificationButtonState="new"
              notifications={notifications || []}
              loadNotifications={loadNotifications}
              markNotificationAsRead={markNotificationAsRead}
              markAllNotificationAsRead={markAllNotificationAsRead}
              markAllNotificationAsSeen={markAllNotificationAsSeen}
              dismissChallengeNotifications={dismissChallengeNotifications}
              accountMenu={ACCOUNT_MENU}
              switchText={ACCOUNT_MENU_SWITCH_TEXT}
              onSwitch={handleSwitchMenu}
              onMenuOpen={handleCloseOpenMore}
              showNotification
              auth={auth}
              profile={normalizedProfile}
              authURLs={HEADER_AUTH_URLS}
              // tracking={tracking}
            />
          )}
          // logo={<Logo />}
          theme="light"
          currentLevel1Id={activeLevel1Id}
          onChangeLevel1Id={handleChangeLevel1Id}
          path={path}
          openMore={openMore}
          setOpenMore={handleChangeOpenMore}
          loggedIn={!_.isEmpty(profile)}
          profileHandle={profile ? profile.handle : ''}
          // tracking={tracking}
        />
      </div>
    );
  }

  return (<div />);
};

Header.defaultProps = {
  profile: null,
  auth: null,
  headerMenu: null,
};

Header.propTypes = {
  profile: PT.shape({
    photoURL: PT.string,
    handle: PT.string,
  }),
  auth: PT.shape(),
  notifications: PT.arrayOf(PT.object).isRequired,
  loadNotifications: PT.func.isRequired,
  markNotificationAsRead: PT.func.isRequired,
  markAllNotificationAsRead: PT.func.isRequired,
  markAllNotificationAsSeen: PT.func.isRequired,
  dismissChallengeNotifications: PT.func.isRequired,
  headerMenu: PT.arrayOf(PT.object),
};

export default Header;
