/* global EDITOR_URL */
import React from 'react';
import PropTypes from 'prop-types';
import urlJoin from 'url-join';

import UserOptionsPop from "./pop-overs/user-options-pop.jsx";
import SignInPop from "./pop-overs/sign-in-pop.jsx";
import NewProjectPop from "./pop-overs/new-project-pop.jsx";
import NewStuffContainer from './overlays/new-stuff.jsx';
import {CurrentUserConsumer} from './current-user.jsx';

const Logo = () => {
  const LOGO_DAY = "https://cdn.gomix.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Flogo-day.svg";
  const LOGO_SUNSET = "https://cdn.gomix.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Flogo-sunset.svg";
  const LOGO_NIGHT = "https://cdn.gomix.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Flogo-night.svg";

  let logo = LOGO_DAY;
  const hour = (new Date()).getHours();
  if ((hour >= 16) && (hour <= 18)) {
    logo = LOGO_SUNSET;
  } else if ((hour > 18) || (hour <= 8)) {
    logo = LOGO_NIGHT;
  }

  return <img className="logo" src={logo} alt="Glitch" />;
};

const ResumeCoding = () => (
  <a className="button button-small button-cta" href="https://glitch.com/edit/" data-track="resume coding">
    <div className="">Resume Coding</div>
  </a>
);

const submitSearch = (event) => {
  if (event.target.children.q.value.trim().length === 0) {
    return event.preventDefault();
  }
};

const SearchForm = ({baseUrl, onSubmit, defaultValue}) => (
  <form action={urlJoin(baseUrl, "search")} method="get" role="search" onSubmit={onSubmit}>
    <input className="search-input" name="q" placeholder="bots, apps, users" defaultValue={defaultValue}/>
  </form>
);

SearchForm.propTypes = {
  baseUrl: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  defaultValue: PropTypes.string.isRequired,
};

const UserOptionsPopWrapper = ({user, overlayNewStuffVisible, api}) => {
  const props = {
    teams: user.teams,
    userLink: user.userLink,
    avatarUrl: user.userAvatarUrl,
    avatarStyle: {backgroundColor: user.color},
    showNewStuffOverlay() {
      return overlayNewStuffVisible(true);
    },
    api: api,
    userIsAnon: user.isAnon,
  };

  return <UserOptionsPop {...props}/>;
};

UserOptionsPopWrapper.propTypes = {
  user: PropTypes.shape({
    login: PropTypes.string,
  }).isRequired,
  overlayNewStuffVisible: PropTypes.func.isRequired,
};

const Header = ({baseUrl, maybeUser, searchQuery, overlayNewStuffVisible, promiseProjectsByIds, api}) => {
  const signedIn = maybeUser && !!maybeUser.login;
  return (
    <header role="banner">
      <div className="header-info">
        <a href={baseUrl}>
          <Logo/>
        </a>
      </div>
     
      <nav>
        <SearchForm baseUrl={baseUrl} onSubmit={submitSearch} defaultValue={searchQuery}/>
        <NewProjectPop promiseProjectsByIds={promiseProjectsByIds}/>
        <ResumeCoding/>
        { !signedIn && <SignInPop/> }
        { maybeUser && <UserOptionsPopWrapper user={maybeUser} overlayNewStuffVisible={overlayNewStuffVisible} api={api} />}
      </nav>
    </header>
  );
};

Header.propTypes = {
  baseUrl: PropTypes.string.isRequired,
  maybeUser: PropTypes.object,
  api: PropTypes.func.isRequired,
};

const HeaderContainer = ({getUserPref, setUserPref, ...props}) => (
  <CurrentUserConsumer>
    {user => (
      <NewStuffContainer
        isSignedIn={!!user && !!user.login}
        getUserPref={getUserPref} setUserPref={setUserPref}
      >
        {showNewStuffOverlay => (
          <Header {...props} maybeUser={user} showNewStuffOverlay={showNewStuffOverlay}/>
        )}
      </NewStuffContainer>
    )}
  </CurrentUserConsumer>
);

export default HeaderContainer;
