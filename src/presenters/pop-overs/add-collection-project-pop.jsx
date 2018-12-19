// add-collection-project-pop.jsx -> Add a project to a collection via the collection page
import React from 'react';
import PropTypes from 'prop-types';
import {debounce} from 'lodash';

import Loader from '../includes/loader.jsx';
import ProjectResultItem from '../includes/project-result-item.jsx';
import ProjectsLoader from '../projects-loader.jsx';

import Notifications from '../notifications.jsx';  

const ProjectResultsUL = ({projects, collection, onClick}) => (
  <ul className="results">
    {projects.map(project => (
      <Notifications key={project.id}>
        {({createNotification}) => (
          <li>
            <ProjectResultItem
              domain={project.domain}
              description={project.description}
              users={project.users}
              id={project.id}
              isActive={false}
              collection={collection}
              action={() => onClick(project, collection, createNotification)}
              isPrivate={project.private}
            />
          </li>
        )}
      </Notifications>
    ))}
  </ul>
);
ProjectResultsUL.propTypes = {
  projects: PropTypes.array.isRequired,
  collection: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
};

const ProjectSearchResults = ({projects, collection, onClick, projectName, excludedProjectsCount}) => {
  if(projects.length > 0) {
    const collectionProjectIds = collection.projects.map((project) => project.id);
    projects = projects.filter( (project) => !collectionProjectIds.includes(project.id));
    
    return (
      <ProjectResultsUL {...{projects, collection, onClick}}/>
    );
  }
  
  if(projectName) {
    return (
      <p className="results-empty">
        {projectName} is already in this collection
        <span role="img" aria-label="">💫</span>
      </p>
    );
  }

  return (
    <p className="results-empty">
      nothing found 
      <span role="img" aria-label="">💫</span><br/>
      {excludedProjectsCount > 0 && (
        <span>(Excluded {excludedProjectsCount} search {(excludedProjectsCount > 1 ? "results" : "result")} already found in collection)</span>
      )}
    </p>
  );
};

ProjectSearchResults.propTypes = {
  collection: PropTypes.object.isRequired,
  projectName: PropTypes.string,
  excludedProjectsCount: PropTypes.number,
};

function isUrl(s) {
  try {
    new URL(s);
    return true;
  } catch (_) {
    return false;  
  }
}

class AddCollectionProjectPop extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      query: '', //The actual search text
      maybeRequest: null, //The active request promise
      maybeResults: null, //Null means still waiting vs empty,
      projectName: '', // the project name if the search result is a Url
      excludedProjectsCount: 0, // number of projects omitted from search
    };
    
    this.loadRecentProjects = this.loadRecentProjects.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
    this.startSearch = debounce(this.startSearch.bind(this), 300);
    this.onClick = this.onClick.bind(this);
  }
  
  componentDidMount(){
    // load user's recent projects to show in dropdown by default
    if(this.props.currentUser.projects.length > 0){
      this.loadRecentProjects();
    }
  }
  
  loadRecentProjects(){
    const MAX_PROJECTS = 20;
    if (this.props.collection.team && this.props.collection.team.projects) {
      this.setState({ maybeResults: this.props.collection.team.projects.slice(0,MAX_PROJECTS) });
    } else {
      this.setState({ maybeResults: this.props.currentUser.projects.slice(0,MAX_PROJECTS) });
    }
  }
  
  handleChange(evt) {
    const query = evt.currentTarget.value.trim();
    this.setState({ query });
    if (query) {
      this.startSearch();
    } else {
      this.clearSearch();
    }
  }
  
  clearSearch() {
    this.setState({
      maybeRequest: null,
      projectName: '',
      excludedProjectsCount: 0,
    });
    this.loadRecentProjects();
  } 
  
  async startSearch() {
    if (!this.state.query) {
      return this.clearSearch();
    }
    
    // reset the results
    this.setState({maybeResults: null});
    
    let searchByUrl = false;
    let query = this.state.query;
    const collectionProjectIds = this.props.collection.projects.map((project) => project.id);
    
    if(isUrl(query)){
      searchByUrl = true;
      // check if the query is a URL or a name of a project
      // Project URL pattern: https://add-to-alexa.glitch.me/, https://glitch.com/~add-to-alexa
      let queryUrl = new URL(query);
      if(queryUrl.href.includes("me") && !queryUrl.href.includes("~")){
        // https://add-to-alexa.glitch.me/
        query = queryUrl.hostname.substring(0, queryUrl.hostname.indexOf('.'));
      } else{
        // https://glitch.com/~add-to-alexa
        query = queryUrl.pathname.substring(queryUrl.pathname.indexOf("~")+1);
      }
    }
    
    let request = null;
    if(!searchByUrl){
      request = this.props.api.get(`projects/search?q=${query}`);
      this.setState({ maybeRequest: request });
    }else{
      request = this.props.api.get(`projects/${query}`);
      this.setState({ maybeRequest: request });
    }
    let {data} = await request;
    
    if(searchByUrl){
      data = [data];
    }
    
    const results = data; 
    
    let originalNumResults = results.length;
    
    let nonCollectionResults = [];
    if(searchByUrl){  
      // get the single result that matches the URL exactly - check with https://community.glitch.me/
      nonCollectionResults = results.filter(result => result.domain == query);
      
      // check if the project is already in the collection
      if(nonCollectionResults.length > 0 && collectionProjectIds.includes(nonCollectionResults[0].id)){
        nonCollectionResults = [];
        this.setState({projectName: query});
      }  
    } else {
      // user is searching by project name  - filter out any projects currently in the collection
      nonCollectionResults = results.filter( result => !collectionProjectIds.includes(result.id));
      
      if(nonCollectionResults.length !== originalNumResults){
        if(originalNumResults === 1){
          // the single search result is already in the collection
          this.setState({projectName: query});
        } else {
          // multiple projects have been excluded from the search results
          this.setState({excludedProjectsCount: originalNumResults});
        }
      }
    }

    this.setState(({ maybeRequest }) => {
      return (request === maybeRequest) ? {
        maybeRequest: null,
        maybeResults: nonCollectionResults,
        recentProjects: null,
      } : {};
    });

  }
  
  onClick(project, collection, createNotification) {
    this.props.togglePopover();
    
    // add project to page if successful
    this.props.addProjectToCollection(project, collection);
    
    // show notification
    createNotification(<p>Added <b><span className="project-name">{project.domain}</span></b></p>, "notifySuccess");
  }
  
  render() {
    // load user's recent projects
    const isLoading = (!!this.state.maybeRequest || !this.state.maybeResults);
    
    return (
      <dialog className="pop-over add-collection-project-pop wide-pop">
        <section className="pop-over-info">
          <input
            autoFocus // eslint-disable-line jsx-a11y/no-autofocus
            value={this.state.query} onChange={this.handleChange}
            className="pop-over-input search-input pop-over-search"
            placeholder="Search by project name or URL"
          />
        </section>
        {(!!this.state.query || this.state.maybeResults) && <section className="pop-over-actions last-section results-list">
          {isLoading && <Loader />}
        
          {!!this.state.maybeResults && 
            <ProjectsLoader api={this.props.api} projects={this.state.maybeResults}>
              {projects => <ProjectSearchResults
                projects={projects}
                onClick={this.onClick}
                collection={this.props.collection}
                projectName={this.state.projectName}
                excludedProjectsCount={this.state.excludedProjectsCount}
              />}
            </ProjectsLoader>
          }          
        </section>}
      </dialog>
    );
  }
}

AddCollectionProjectPop.propTypes = {
  api: PropTypes.func.isRequired,
  collection: PropTypes.object.isRequired,
  addProjectToCollection: PropTypes.func.isRequired,
  togglePopover: PropTypes.func.isRequired,
  currentUser: PropTypes.object.isRequired,
};

export default AddCollectionProjectPop;