import React from 'react';
import PropTypes from 'prop-types';

import {CurrentUserProvider} from './current-user.jsx';
import {Notifications} from './notifications.jsx';

import Header from './header.jsx';
import Footer from './footer.jsx';

const getHeaderProps = (application) => ({
  api: application.api(),
  baseUrl: application.normalizedBaseUrl(),
  searchQuery: application.searchQuery(),
  getUserPref: application.getUserPref,
  setUserPref: application.updateUserPrefs,
});

const Layout = ({children, application}) => (
  <div className="content">
    <Notifications>
      <CurrentUserProvider model={application.currentUser()}>
        <Header {...getHeaderProps(application)}/>
        {children}
        <Footer/>
      </CurrentUserProvider>
    </Notifications>
  </div>
);
Layout.propTypes = {
  application: PropTypes.any.isRequired,
  children: PropTypes.node.isRequired,
};

export default Layout;