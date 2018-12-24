/* global EDITOR_URL */
import React from 'react';
import PropTypes from 'prop-types';

import {Redirect} from 'react-router-dom';
import {TrackedExternalLink} from './analytics';
import Link from './includes/link';
import Logo from './includes/logo';

import UserOptionsPop from './pop-overs/user-options-pop';
import SignInPop from './pop-overs/sign-in-pop';
import NewProjectPop from './pop-overs/new-project-pop';
import NewStuffContainer from './overlays/new-stuff';
import {CurrentUserConsumer} from './current-user';


const ResumeCoding = () => (
  <TrackedExternalLink name="Resume Coding clicked" className="button button-small button-cta" to={EDITOR_URL}>
    Resume Coding
  </TrackedExternalLink>
);

class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.defaultValue || '',
      submitted: false,
    };
  }
  onChange(event) {
    this.setState({value: event.target.value});
  }
  onSubmit(event) {
    event.preventDefault();
    if (!this.state.value) return;
    this.setState({submitted: true});
  }
  render() {
    const {value, submitted} = this.state;
    return (
      <form action="/search" method="get" role="search" onSubmit={this.onSubmit.bind(this)}>
        <input className="search-input" name="q" placeholder="bots, apps, users" value={value} onChange={this.onChange.bind(this)}/>
        {submitted && <Redirect to={`/search?q=${value}`} push={true}/>}
      </form>
    );
  }
}
SearchForm.propTypes = {
  defaultValue: PropTypes.string,
};

const Header = ({api, maybeUser, clearUser, searchQuery, showNewStuffOverlay}) => {
  return (
    <header role="banner">
      <div className="header-info">
        <Link to="/">
          <Logo/>
        </Link>
      </div>

      <nav>
        <SearchForm defaultValue={searchQuery}/>
        <NewProjectPop api={api}/>
        { !!maybeUser && !!maybeUser.projects.length && <ResumeCoding/> }
        { !(maybeUser && maybeUser.login) && <SignInPop api={api}/> }
        { !!maybeUser && <UserOptionsPop user={maybeUser} signOut={clearUser} showNewStuffOverlay={showNewStuffOverlay} api={api}/> }
      </nav>
    </header>
  );
};

Header.propTypes = {
  maybeUser: PropTypes.object,
  api: PropTypes.func.isRequired,
};

const HeaderContainer = ({...props}) => (
  <CurrentUserConsumer>
    {(user, userFetched, {clear}) => (
      <NewStuffContainer isSignedIn={!!user && !!user.login}>
        {showNewStuffOverlay => (
          <Header {...props} maybeUser={user} clearUser={clear} showNewStuffOverlay={showNewStuffOverlay}/>
        )}
      </NewStuffContainer>
    )}
  </CurrentUserConsumer>
);

export default HeaderContainer;
