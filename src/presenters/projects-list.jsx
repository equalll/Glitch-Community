import React from 'react';
import PropTypes from 'prop-types';
import ProjectItem from './project-item.jsx';
import Link from './includes/link';

export const ProjectsList = ({title, placeholder, ...props}) => (
  <article className="projects">
    <h2>{title}</h2>

    {!!(placeholder && !props.projects.length) && (
      <div className="placeholder">{placeholder}</div>
    )}

    <ExpandyProjects {...props}></ExpandyProjects>
  </article>
);

ProjectsList.propTypes = {
  api: PropTypes.any,
  projects: PropTypes.array.isRequired,
  title: PropTypes.node.isRequired,
  placeholder: PropTypes.node,
};

class ExpandyProjects extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = { expanded: false };
    this.handleClick = this.handleClick.bind(this);
  }
  
  handleClick() {
    this.setState({expanded: true});
  }
  
  render() {
    const maxProjects = this.props.maxCollapsedProjects;
    const totalProjects = this.props.projects.length;
    const hiddenProjects = totalProjects - maxProjects;
    
    let {projects, ...props} = this.props;
    
    let shouldShowButton = false;
    if(!this.state.expanded) {
      shouldShowButton = hiddenProjects > 0;
      projects = projects.slice(0, maxProjects);
    }
    
    return (
      <>
        <ProjectsUL projects={projects} {...props}/>
        { shouldShowButton && <button className="button-tertiary" onClick={this.handleClick}>Show {hiddenProjects} More</button>}
      </>
    );
  }
}

ExpandyProjects.propTypes = {
  projects: PropTypes.array.isRequired,
  maxCollapsedProjects: PropTypes.number,
};

ExpandyProjects.defaultProps = {
  maxCollapsedProjects: 12,
};


export const ProjectsUL = ({projectCount, collectionUrl, ...props}) => {
  return (
    <ul className="projects-container">
      { props.projects.map(project => (
        <ProjectItem key={project.id} {...{project}} {...props}></ProjectItem>
      ))}

      {props.homepageCollection &&
        <Link to={collectionUrl} className="collection-view-all">View all {projectCount} projects →</Link>
      }
    </ul>
  );
};

ProjectsUL.propTypes = {
  projects: PropTypes.array.isRequired,
  homepageCollection: PropTypes.bool,
  collectionUrl: PropTypes.string,
  projectCount: PropTypes.number,
};


export default ProjectsList;
