import React from 'react';
import PropTypes from 'prop-types';

import {Route, Switch, withRouter} from 'react-router-dom';

import categories from '../../curated/categories';
import rootTeams from '../../curated/teams';

import {CurrentUserConsumer} from '../current-user.jsx';

import IndexPage from './index.jsx';
import {FacebookLoginPage, GitHubLoginPage, EmailTokenLoginPage} from './login.jsx';
import JoinTeamPage from './join-team.jsx';
import QuestionsPage from './questions.jsx';
import ProjectPage from './project.jsx';
import {TeamPage, UserPage, TeamOrUserPage} from './team-or-user.jsx';
import SearchPage from './search.jsx';
import CategoryPage from './category.jsx';
import CollectionPage from './collection.jsx';
import {NotFoundPage} from './error.jsx';
import SecretPage from './secret.jsx';

/* global EXTERNAL_ROUTES */

const parse = (search, name) => {
  const params = new URLSearchParams(search);
  return params.get(name);
};

class ExternalPageReloader extends React.Component {
  componentDidMount() {
    window.location.reload();
  }
  render() {
    return null;
  }
}

class PageChangeHandlerBase extends React.Component {
  componentDidUpdate(prev) {
    if (this.props.location.key !== prev.location.key) {
      window.scrollTo(0, 0);
      this.props.reloadCurrentUser();
      
      try {
        const analytics = window.analytics;
        if (analytics) {
          analytics.page();
        }
      } catch (ex) {
        console.error("Error tracking page transition.", ex);
      }
    }
  }
  render() {
    return null;
  }
}
const PageChangeHandler = withRouter(({location}) => (
  <CurrentUserConsumer>
    {(user, fetched, {reload}) => <PageChangeHandlerBase location={location} reloadCurrentUser={reload}/>}
  </CurrentUserConsumer>
));

const Router = ({api}) => (
  <>
    <PageChangeHandler/>
    <Switch>
      <Route path="/" exact render={({location}) => <IndexPage key={location.key} api={api}/>}/>
      <Route path="/index.html" exact strict render={({location}) => <IndexPage key={location.key} api={api}/>}/>

      <Route path="/login/facebook" exact render={({location}) => <FacebookLoginPage key={location.key} api={api} code={parse(location.search, 'code')} hash={parse(location.search, 'hash')}/>}/>
      <Route path="/login/github" exact render={({location}) => <GitHubLoginPage key={location.key} api={api} code={parse(location.search, 'code')} hash={parse(location.search, 'hash')}/>}/>
      <Route path="/login/email" exact render={({location}) => <EmailTokenLoginPage key={location.key} api={api} token={parse(location.search, 'token')} hash={parse(location.search, 'hash')}/>}/>
      
      <Route path="/join/@:teamUrl/:joinToken" exact render={({match}) => <JoinTeamPage key={location.key} api={api} {...match.params}/>}/>

      <Route path="/questions" exact render={({location}) => <QuestionsPage key={location.key} api={api}/>}/>

      <Route path="/~:name" exact render={({location, match}) => <ProjectPage key={location.key} api={api} name={match.params.name}/>}/>

      <Route path="/@:name" exact render={({location, match}) => <TeamOrUserPage key={location.key} api={api} name={match.params.name}/>}/>

      <Route path="/@:owner/:name" exact render={({location, match}) => <CollectionPage key={location.key} api={api} ownerName={match.params.owner} name={match.params.name}/>}/>

      <Route path="/user/:id(\d+)" exact render={({location, match}) => <UserPage key={location.key} api={api} id={parseInt(match.params.id, 10)} name={`user ${match.params.id}`}/>}/>

      {Object.keys(rootTeams).map(name => (
        <Route key={name} path={`/${name}`} exact render={({location}) => <TeamPage key={location.key} api={api} id={rootTeams[name]} name={name}/>}/>
      ))}

      <Route path="/search" exact render={({location}) => <SearchPage key={location.key} api={api} query={parse(location.search, 'q')}/>}/>

      {categories.map(category => (
        <Route key={category.url} path={`/${category.url}`} exact render={({location}) => <CategoryPage key={location.key} api={api} category={category}/>}/>
      ))}

      <Route path="/secret" exact render={({location}) => <SecretPage key={location.key}/>}></Route>

      {EXTERNAL_ROUTES.map(route => (
        <Route key={route} path={route} render={({location}) => <ExternalPageReloader key={location.key}/>}/>
      ))}

      <Route render={({location}) => <NotFoundPage api={api} key={location.key}/>}/>
    </Switch>
  </>
);
Router.propTypes = {
  api: PropTypes.any.isRequired,
};

export default Router;