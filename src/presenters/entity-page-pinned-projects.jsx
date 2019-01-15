/* global analytics APP_URL */

import React from 'react';
import PropTypes from 'prop-types';

import ProjectsList from './projects-list.jsx';
import {EditButton, RemixButton} from './includes/project-actions.jsx';
import ReportButton from './pop-overs/report-abuse-pop.jsx';
import AddProjectToCollection from './includes/add-project-to-collection.jsx';

/* globals Set */

const EntityPagePinnedProjects = ({api, projects, currentUser, isAuthorized, removePin, projectOptions, addProjectToCollection,}) => {
  
  const pinnedVisible = (isAuthorized || projects.length);
    
  const pinnedTitle = (
    <>
      Pinned Projects
      <span className="emoji pushpin emoji-in-title"></span>
    </>
  );
  
  return (
    <>
     {projects.length > 0 && 
        <ProjectsList title={pinnedTitle}
          projects={projects}
          api={api} 
          projectOptions={isAuthorized ? {removePin, ...projectOptions} 
            : (currentUser && currentUser.login ? {...projectOptions} : {})
          }
          extraClasses="pinned"
        />
     }
    </>
  );
};
EntityPagePinnedProjects.propTypes = {
  addProjectToCollection: PropTypes.func,
  api: PropTypes.func.isRequired,
  currentUser: PropTypes.object,
  isAuthorized: PropTypes.bool.isRequired,
  projects: PropTypes.array.isRequired,
  removePin: PropTypes.func.isRequired,
  projectOptions: PropTypes.object,
};

const EntityPagePinnedProjectsContainer = ({api, projects, maybeCurrentUser, ...props}) => (  
  <EntityPagePinnedProjects api={api} projects={projects} currentUser={maybeCurrentUser} {...props}/>  
);

export default EntityPagePinnedProjectsContainer;  
