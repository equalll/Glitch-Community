/* globals API_URL */

import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import {configureScope, captureException, captureMessage} from '../utils/sentry';
import LocalStorage from './includes/local-storage.jsx';

const {Provider, Consumer} = React.createContext();

// Default values for all of the user fields we need you to have
// We always generate a 'real' anon user, but use this until we do
const defaultUser = {
  id: 0,
  login: null,
  name: null,
  description: '',
  color: '#aaa',
  avatarUrl: null,
  avatarThumbnailUrl: null,
  hasCoverImage: false,
  coverColor: null,
  emails: [],
  features: [],
  projects: [],
  teams: [],
  collections: [],
};

function identifyUser(user) {
  if (user) {
    console.log("👀 current user is", user);
    console.log("🌈 login", user.login, user.id);
  } else {
    console.log("👻 logged out");
  }
  try {
    const analytics = window.analytics;
    if (analytics && user && user.login) {
      const emailObj = Array.isArray(user.emails) && user.emails.find((email) => email.primary);
      const email = emailObj && emailObj.email;
      analytics.identify(user.id, {
        name: user.name,
        login: user.login,
        email,
        created_at: user.createdAt,
      });
    }
    if (user) {
      configureScope((scope) => {
        scope.setUser({
          id: user.id,
          login: user.login,
        });
      });
    } else {
      configureScope((scope) => {
        scope.setUser({
          id: null,
          login: null,
        });
      });
    }
  } catch (error) {
    console.error(error);
    captureException(error);
  }
}

// Test if two user objects reference the same person
function usersMatch(a, b) {
  if (a && b && a.id === b.id && a.persistentToken === b.persistentToken) {
    return true;
  } else if (!a && !b) {
    return true;
  }
  return false;
}

// This takes sharedUser and cachedUser
// sharedUser is stored in localStorage['cachedUser']
// cachedUser is stored in localStorage['community-cachedUser']
// sharedUser syncs with the editor and is authoritative on id and persistentToken
// cachedUser mirrors GET /users/{id} and is what we actually display

class CurrentUserManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fetched: false, // Set true on first complete load
      working: false, // Used to prevent simultaneous loading
    };
  }
  
  api() {
    if (this.props.sharedUser) {
      return axios.create({
        baseURL: API_URL,
        headers: {
          Authorization: this.props.sharedUser.persistentToken,
        },
      });
    } 
    return axios.create({
      baseURL: API_URL,
    });
  }
  
  async getSharedUser() {
    try {
      const {data: {user}} = await this.api().get(`boot?latestProjectOnly=true`);
      return user;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return undefined;
      }
      throw error;
    }
  }
  
  async getCachedUser() {
    const {sharedUser} = this.props;
    if (!sharedUser) return undefined;
    if (!sharedUser.id || !sharedUser.persistentToken) return 'error';
    try {
      const {data} = await this.api().get(`users/${sharedUser.id}`);
      if (!usersMatch(sharedUser, data)) {
        return 'error';
      }
      return data;
    } catch (error) {
      if (error.response && (error.response.status === 401 || error.response.status === 404)) {
        // 401 means our token is bad, 404 means the user doesn't exist
        return 'error';
      }
      throw error;
    }
  }
  
  async load() {
    if (this.state.working) return;
    this.setState({working: true});
    const {sharedUser, cachedUser} = this.props;
    if (!usersMatch(sharedUser, cachedUser)) {
      this.props.setCachedUser(undefined);
    }
    if (sharedUser) {
      const newCachedUser = await this.getCachedUser();
      if (newCachedUser === 'error') {
        // Sounds like our shared user is bad
        // Fix it and componentDidUpdate will reload
        this.setState({fetched: false});
        const newSharedUser = await this.getSharedUser();
        this.props.setSharedUser(newSharedUser);
        console.warn('Fixed shared cachedUser from', sharedUser, 'to', newSharedUser);
        captureMessage('Invalid cachedUser', {extra: {
          from: sharedUser || null,
          to: newSharedUser || null,
        }});
      } else {
        this.props.setCachedUser(newCachedUser);
        this.setState({fetched: true});
      }
    } else {
      const {data} = await this.api().post('users/anon');
      this.props.setSharedUser(data);
    }
    this.setState({working: false});
  }
  
  componentDidMount() {
    identifyUser(this.props.cachedUser);
    this.load();
  }
  
  componentDidUpdate(prev) {
    const {cachedUser, sharedUser} = this.props;
    
    if (!usersMatch(cachedUser, prev.cachedUser)) {
      identifyUser(cachedUser);
    }
    
    if (!usersMatch(cachedUser, sharedUser) || !usersMatch(sharedUser, prev.sharedUser)) {
      this.load();
    }
    
    // hooks for easier debugging
    window.currentUser = cachedUser;
    window.api = this.api();
  }
  
  render() {
    const {children, sharedUser, cachedUser, setSharedUser, setCachedUser} = this.props;
    return children({
      api: this.api(),
      currentUser: {...defaultUser, ...sharedUser, ...cachedUser},
      fetched: !!cachedUser && this.state.fetched,
      reload: () => this.load(),
      login: user => setSharedUser(user),
      update: changes => setCachedUser({...cachedUser, ...changes}),
      clear: () => setSharedUser(undefined),
    });
  }
}
CurrentUserManager.propTypes = {
  sharedUser: PropTypes.shape({
    id: PropTypes.number,
    persistentToken: PropTypes.string,
  }),
  cachedUser: PropTypes.object,
  setSharedUser: PropTypes.func.isRequired,
  setCachedUser: PropTypes.func.isRequired,
};

export const CurrentUserProvider = ({children}) => (
  <LocalStorage name="community-cachedUser" default={null}>
    {(cachedUser, setCachedUser, loadedCachedUser) => (
      <LocalStorage name="cachedUser" default={null}>
        {(sharedUser, setSharedUser, loadedSharedUser) => (loadedSharedUser && loadedCachedUser &&
          <CurrentUserManager sharedUser={sharedUser} setSharedUser={setSharedUser} cachedUser={cachedUser} setCachedUser={setCachedUser}>
            {({api, ...props}) => (
              <Provider value={props}>
                {children(api)}
              </Provider>
            )}
          </CurrentUserManager>
        )}
      </LocalStorage>
    )}
  </LocalStorage>
);
CurrentUserProvider.propTypes = {
  children: PropTypes.func.isRequired,
};

export const CurrentUserConsumer = (props) => {
  return (
    <Consumer>
      {({currentUser, fetched, ...funcs}) => props.children(currentUser, fetched, funcs, props)}
    </Consumer>
  );
};

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