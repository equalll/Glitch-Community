import React from 'react';
import PropTypes from 'prop-types';
import ProjectResultItem from '../includes/project-result-item.jsx';

export class AddTeamProjectPop extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      projects: [],
      source: 'templates',
      filterPlaceholder: 'Filter projects'
    };
    this.onClick = this.onClick.bind(this);
    this.updateFilter = this.updateFilter.bind(this);
    
    // this.toggleSource = this.toggleSource.bind(this);
    
    this.activeIfSourceIsTemplates = this.activeIfSourceIsTemplates.bind(this);
    this.activeIfSourceIsMyProjects = this.activeIfSourceIsMyProjects.bind(this);
  }
  
  updateFilter(query) {
    const projects = this.filterProjects(query, this.props.myProjects, this.props.teamProjects);
    this.setState({projects});
  }
  
  componentDidMount() {
    this.updateFilter("");
    // TODO: set source based on ls pref , default to templates
  }
  
  filterProjects(query, myProjects, teamProjects) {
    query = query.toLowerCase().trim();
    
    // if source is 'templates':
    
    
    // if source is 'my-projects':
    
    const teamProjectIds = teamProjects.map(({id})=>id);


    // only show projects not already on the team

    const availableProjects = myProjects.filter(
      ({id}) => !teamProjectIds.includes(id)
    );
    
    // default show , no query
    
    const maxProjects = 25;
    if(!query) {
      return availableProjects.splice(0,maxProjects);
    }
    
    // Filtering happens here on available projects
    
    const filteredProjects = [];
    for(let project of availableProjects) {
      if(filteredProjects.length > maxProjects){
        break;
      }
      const titleMatch = project.domain.toLowerCase().includes(query);
      const descMatch = project.description.toLowerCase().includes(query);
      if(titleMatch || descMatch) {
        filteredProjects.push(project);
      }
    }
    return filteredProjects;
  }
  
  activeIfSourceIsTemplates() {
    if (this.state.source === 'templates') {
      return 'active'
    }
  }
  
  activeIfSourceIsMyProjects() {
    if (this.state.source === 'my-projects') {
      return 'active'
    }
  }
  
  onClick(event, projectId) {
    // TODO do a diff thing w remixing if source is templates
    event.preventDefault();
    this.props.togglePopover();
    this.props.addProject(projectId);
  }
  
  toggleSource(event) {
    let newSource = event.target.dataset.source
    if (newSource === this.state.source) {
      return
    }
    if (newSource === 'templates') {
      this.setState({
        source: 'templates',
        filterPlaceholder: 'Filter templates',
      })
    } else if (newSource === 'my-projects') {
      this.setState({
        source: 'my-projects',
        filterPlaceholder: 'Filter projects',
      })
    }
    this.filterInput.focus()
  }

  render() {
    const showResults = this.state.projects.length > 0;
    return (
      <dialog className="pop-over add-team-project-pop">
        <section className="pop-over-info">
          <div className="segmented-buttons">
            <button 
              className={`button-small button-tertiary button-on-secondary ${this.activeIfSourceIsTemplates()}`} 
              onClick={this.toggleSource.bind(this)} 
              data-source="templates" 
            >
              Templates
            </button>
            <button 
              className={`button-small button-tertiary button-on-secondary ${this.activeIfSourceIsMyProjects()}`} 
              onClick={this.toggleSource.bind(this)} 
              data-source="my-projects" 
            >
              My Projects
            </button>
          </div>
          <input
            ref={(input) => { this.filterInput = input; }}
            onChange={(event) => {this.updateFilter(event.target.value);}}
            id="team-project-search" className="pop-over-input search-input pop-over-search"
            placeholder= {this.state.filterPlaceholder}
            autoFocus // eslint-disable-line jsx-a11y/no-autofocus
          />
        </section>
        { showResults && (
          <section className="pop-over-actions results-list">
            <ul className="results">
              { this.state.projects.map((project) => (
                <li key={project.id}>
                  <ProjectResultItem 
                    action={(event) => this.onClick(event, project.id)} 
                    {...project}
                    title={project.domain}/>
                </li>
              ))}
            </ul>
          </section>
        )}
      </dialog>
    );
  }
}

AddTeamProjectPop.propTypes = {
  myProjects: PropTypes.array.isRequired,
  teamProjects: PropTypes.array.isRequired,
  addProject: PropTypes.func.isRequired,
  togglePopover: PropTypes.func.isRequired,
};


export default AddTeamProjectPop;
