import React from 'react';
import PropTypes from 'prop-types';

import Observable from 'o_0';
import Observed from './includes/observed.jsx';

const {Provider, Consumer} = React.createContext();

export const CurrentUserProvider = ({model, children}) => (
  <Provider value={model}>{children}</Provider>
);
CurrentUserProvider.propTypes = {
  model: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
};

export const CurrentUserConsumer = ({children}) => (
  <Consumer>
    {model => (
      <Observed
        propsObservable={Observable(() => {
          if (model && model.id()) {
            const user = model.asProps();
            user.teams;
            return {user, fetched: model.fetched()};
          }
          return {user: null, fetched: false};
        })}
        component={({user, fetched}) => children(user, fetched)}
      />
    )}
  </Consumer>
);
CurrentUserConsumer.propTypes = {
  children: PropTypes.func.isRequired,
};

export function normalizeUser(user, currentUser) {
  return user.id === (currentUser && currentUser.id) ? currentUser : user;
}

export function normalizeUsers(users, currentUser) {
  return users.map(user => normalizeUser(user, currentUser));
}

export function normalizeProject({users, ...project}, currentUser) {
  return {users: users ? normalizeUsers(users, currentUser) : [], ...project};
}

export function normalizeProjects(projects, currentUser) {
  return projects.map(project => normalizeProject(project, currentUser));
}