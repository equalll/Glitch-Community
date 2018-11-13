import React from 'react';
import PropTypes from 'prop-types';

import ProjectResultItem from '../includes/project-result-item.jsx';
import PopoverContainer from './popover-container.jsx';

const AllProjectsItem = ({currentProjectDomain, action}) => {
  const BENTO_BOX = 'https://cdn.glitch.com/55f8497b-3334-43ca-851e-6c9780082244%2Fbento-box.png?1502469566743';
  let resultsClass = "button-unstyled result";
  if (!currentProjectDomain) {
    resultsClass += " active";
  }
  return (
    <button className={resultsClass} onClick={action}>
      <img className="avatar" src={BENTO_BOX} alt='Bento emoji'/>
      <div className="result-name" title="All Projects">All Projects</div>
    </button>
  );
};

AllProjectsItem.propTypes = {
  currentProjectDomain: PropTypes.string.isRequired,
  action: PropTypes.func.isRequired,
};


const isActive = (currentProjectDomain, project) => {
  if (currentProjectDomain === project.domain) {
    return true;
  }
};

const PopOver = ({projects, togglePopover, setFilter, filter, updateProjectDomain, currentProjectDomain}) => {
  const onClick = (domain) => {
    togglePopover();
    updateProjectDomain(domain);
    setFilter("");
  };
  
  const filteredProjects = projects.filter(({domain}) => {
    return domain.toLowerCase().includes(filter.toLowerCase());
  });
  
  return (
    <dialog className="pop-over analytics-projects-pop wide-pop">
      <section className="pop-over-info">
        <input
          autoFocus // eslint-disable-line jsx-a11y/no-autofocus
          onChange={(event) => {setFilter(event.target.value);}} 
          id="analytics-project-filter" 
          className="pop-over-input search-input pop-over-search" 
          placeholder="Filter projects"
          value={filter}
        />
      </section>
      <section className="pop-over-actions results-list">
        <ul className="results">
          <li className="button-unstyled">
            <AllProjectsItem 
              currentProjectDomain = {currentProjectDomain}
              action = {() => onClick('')}
            />
          </li>
          { filteredProjects.map((project) => (
            <li key={project.id} className="button-unstyled">
              <ProjectResultItem 
                {...project} 
                action = {() => onClick(project.domain)} 
                isActive = {isActive(currentProjectDomain, project)}
              />
            </li>
          ))}
        </ul>
      </section>
    </dialog>
  ); 
};

PopOver.propTypes = {
  projects: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    domain: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  })).isRequired,
  togglePopover: PropTypes.func.isRequired,
  setFilter: PropTypes.func.isRequired,
  filter: PropTypes.string.isRequired,
  updateProjectDomain: PropTypes.func.isRequired,
  currentProjectDomain: PropTypes.string.isRequired,
};


class TeamAnalyticsProjectPop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {filter: ""};
    this.setFilter = this.setFilter.bind(this);
  }
  
  setFilter(query) {
    this.setState({filter: query});
  }
  
  render() {
    const {updateProjectDomain, currentProjectDomain, projects} = this.props;
    return (
      <PopoverContainer>
        {({visible, togglePopover}) => (
          <div className="button-wrap">
            <button className="button-small button-tertiary" onClick={togglePopover}>
              Filter: {currentProjectDomain || 'All Projects'}
            </button>
            {visible && 
              <PopOver 
                projects={projects}
                updateProjectDomain={updateProjectDomain}
                currentProjectDomain={currentProjectDomain}
                togglePopover={togglePopover}
                setFilter={this.setFilter}
                filter={this.state.filter}
              />
            }
          </div>
        )}
      </PopoverContainer>
    );
  }
}

TeamAnalyticsProjectPop.propTypes = {
  updateProjectDomain: PropTypes.func.isRequired,
  currentProjectDomain: PropTypes.string.isRequired,
};

export default TeamAnalyticsProjectPop;
