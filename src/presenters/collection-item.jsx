import React from 'react';
import PropTypes from 'prop-types';
import Pluralize from 'react-pluralize';

import {TruncatedMarkdown} from './includes/markdown.jsx';
import CollectionOptionsContainer from "./pop-overs/collection-options-pop.jsx";
import { Link, CollectionLink } from './includes/link';
import Loader from './includes/loader';
import CollectionAvatar from './includes/collection-avatar.jsx';

import {getAvatarUrl} from '../models/project.js';

import {getContrastTextColor, hexToRgbA} from '../models/collection';

const ProjectsPreview = ({projects}) => {
  
  return (
    <>
      <ul className="projects-preview">
        { projects.slice(0,3).map(project => (
          <li key={project.id} className={"project-container " + (project.private ? "private" : '')}>
            <img className="avatar" src={getAvatarUrl(project.id)} alt={`Project avatar for ${project.domain}`}/>
            <div className="project-name">{project.domain}</div>
            <div className="project-badge private-project-badge" aria-label="private"></div>
          </li>
        )) }
      </ul>
      <div className="collection-link">
        View <Pluralize count={projects.length} singular="project"/> →
      </div>
    </>
  );
};

ProjectsPreview.propTypes = {
  projects: PropTypes.any.isRequired,
};

class CollectionItem extends React.Component{
  constructor(props){
    super(props);
  }
  
  render(){
    const {collection, deleteCollection, isAuthorized} = this.props;
    return (
      <li>
        {isAuthorized && (
          <CollectionOptionsContainer collection={collection} deleteCollection={deleteCollection}></CollectionOptionsContainer>
        )}

        {(collection &&
          <CollectionLink collection={collection} className="button-area">
            <div className="collection" id={"collection-" + collection.id}>
              <div className="collection-container">
                <div className="collection-info" style={{backgroundColor: collection.coverColor}}> 
                  <div className="avatar-container">
                    <div className="avatar">
                      <CollectionAvatar backgroundColor={hexToRgbA(collection.coverColor)} collectionId={collection.id}/>
                    </div>
                  </div>
                  <div className="collection-name-description">
                    <Link to={`/@${userLogin}/${collection.url}`}>                      
                      <div className="button">
                        <span className="project-badge private-project-badge" aria-label="private"></span>
                        <div className="project-name">{collection.name}</div>
                      </div>
                    </Link>
                    <div className="description" style={{color: getContrastTextColor(collection.coverColor)}}><TruncatedMarkdown length={96}>{collection.description}</TruncatedMarkdown></div>
                  </div>

                  <div className="overflow-mask"></div>
                </div>

                {collection.projects ? (collection.projects.length > 0
                  ? <ProjectsPreview projects={collection.projects} color={collection.coverColor} collection={collection}/>
                  :
                  <div className="projects-preview empty">
                    {(isAuthorized
                      ? <p>This collection is empty – add some projects <span role="img" aria-label="">☝️</span></p>
                      : <p>No projects to see in this collection just yet.</p>
                    )}
                  </div>
                ) : <div className="collection-link"><Loader/></div>}
              </div>
            </div>
          </CollectionLink>
        )}
      </li>
    );
  }
}

CollectionItem.propTypes = {
  collection: PropTypes.object.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
  deleteCollection: PropTypes.func,
};

export default CollectionItem;