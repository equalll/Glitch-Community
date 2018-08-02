import React from 'react';
import PropTypes from 'prop-types';

import {getAvatarStyle, getProfileStyle} from '../models/user';
import {CurrentUserConsumer} from './current-user.jsx';

import {CoverContainer} from './includes/profile.jsx';
import Loader from './includes/loader.jsx';
import ProjectsLoader from './projects-loader.jsx';
import {ProjectsUL} from './projects-list.jsx';
import SignInPop from './pop-overs/sign-in-pop.jsx';

const RecentProjectsContainer = ({children, user}) => (
  <section className="profile recent-projects">
    <h2><a href={user.userLink}>Your Projects →</a></h2>
    <CoverContainer style={getProfileStyle(user)}>
      <div className="profile-avatar">
        <div className="user-avatar-container">
          <a href={user.userLink}>
            <div className={`user-avatar ${!user.login ? 'anon-user-avatar' : ''}`} style={getAvatarStyle(user)} alt=""></div>
          </a>
          {!user.login && <div className="anon-user-sign-up"><SignInPop/></div>}
        </div>
      </div>
      <article className="projects">
        {children}
      </article>
    </CoverContainer>
  </section>
);
RecentProjectsContainer.propTypes = {
  children: PropTypes.node.isRequired,
  user: PropTypes.shape({
    avatarUrl: PropTypes.string,
    color: PropTypes.string.isRequired,
    coverColor: PropTypes.string,
    hasCoverImage: PropTypes.bool.isRequired,
    id: PropTypes.number.isRequired,
    login: PropTypes.string,
    userLink: PropTypes.string.isRequired,
  }).isRequired,
};

const RecentProjects = ({api}) => (
  <CurrentUserConsumer>
    {(user, fetched) => (
      <RecentProjectsContainer user={user}>
        {fetched ? (
          <ProjectsLoader api={api} projects={user.projects.slice(0,3)}>
            {projects => <ProjectsUL projects={projects}/>}
          </ProjectsLoader>
        ) : <Loader/>}
      </RecentProjectsContainer>
    )}
  </CurrentUserConsumer>
);
RecentProjects.propTypes = {
  api: PropTypes.any.isRequired,
};

export default RecentProjects;