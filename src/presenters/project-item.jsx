import React from 'react';
import PropTypes from 'prop-types';

import {getAvatarUrl} from '../models/project.js';

import {ProjectLink} from './includes/link.jsx';
import {TruncatedMarkdown} from './includes/markdown.jsx';
import ProjectOptionsPop from "./pop-overs/project-options-pop.jsx";
import UsersList from "./users-list.jsx";

import {getContrastTextColor} from '../models/collection.js'; 

export const ProjectItem = ({api, project, collectionColor, homepageCollection, ...props}) => {
  return (
    <li>
      <UsersList glitchTeam={project.showAsGlitchTeam} users={project.users} extraClass="single-line" teams={project.teams}/>      
      <ProjectOptionsPop {...{project, api}} {...props}/>
      <ProjectLink project={project} className="button-area">
        <div className={['project', project.private ? 'private-project' : ''].join(' ')} 
          style={project.private ? {} : {backgroundColor: collectionColor, borderBottomColor:collectionColor}}
          data-track="project" data-track-label={project.domain}>
          <div className="project-container">
            <img className="avatar" src={getAvatarUrl(project.id)} alt={`${project.domain} avatar`}/>
            <div className="button">
              <span className="project-badge private-project-badge" aria-label="private"></span>
              <div className="project-name">{project.domain}</div>
            </div>
            {( homepageCollection 
              ?
              <div className="description">
                <TruncatedMarkdown length={80}>{project.description}</TruncatedMarkdown>
              </div>
              :
              <div className="description" 
                style={project.private ? {} : {color: (props.category ? "black" : (collectionColor ? getContrastTextColor(collectionColor) : "black" ) )}}>
                <TruncatedMarkdown length={80}>{project.description}</TruncatedMarkdown></div>
            )}
            <div className="overflow-mask" style={project.private ? {} : {backgroundColor: collectionColor}}></div>
          </div>
        </div>
      </ProjectLink>
    </li>
  );
};

ProjectItem.propTypes = {
  api: PropTypes.func,
  category: PropTypes.bool,
  currentUser: PropTypes.object,
  project: PropTypes.shape({
    description: PropTypes.string.isRequired,
    domain: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    private: PropTypes.bool.isRequired,
    showAsGlitchTeam: PropTypes.bool.isRequired,
    users: PropTypes.array.isRequired,
    teams: PropTypes.array,
  }).isRequired,
  collectionColor: PropTypes.string,
  homepageCollection: PropTypes.bool,
  projectOptions: PropTypes.object,
};


export default ProjectItem;