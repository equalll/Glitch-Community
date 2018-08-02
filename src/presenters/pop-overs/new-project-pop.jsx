import React from 'react';
import PropTypes from 'prop-types';

import Loader from '../includes/loader.jsx';
import ProjectResultItem from '../includes/project-result-item.jsx';
import PopoverContainer from './popover-container.jsx';

import ProjectModel, {getRemixUrl} from '../../models/project';

const NewProjectPop = ({projects}) => (
  <div className="pop-over new-project-pop">
    <section className="pop-over-actions results-list">
      <div className="results">
        {projects.length ? projects.map((project) => (
          <a key={project.id} href={getRemixUrl(project.domain)}>
            <ProjectResultItem {...project} users={[]} action={()=>{
              /* global analytics */
              analytics.track("New Project Clicked", {
                baseDomain: project.domain,
                origin: "community new project pop",
              });
            }} />
          </a>
        )) : <Loader/>}
      </div>
    </section>
  </div>
);

NewProjectPop.propTypes = {
  projects: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    domain: PropTypes.string.isRequired,
  })).isRequired,
};

class NewProjectPopContainer extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {projects: []};
  }
  
  async load() {
    const projectIds = [
      'a0fcd798-9ddf-42e5-8205-17158d4bf5bb', // 'hello-express'
      'cb519589-591c-474f-8986-a513f22dbf88', // 'hello-sqlite'
      '929980a8-32fc-4ae7-a66f-dddb3ae4912c', // 'hello-webpage'
    ];
    const {data} = await this.props.api.get(`projects/byIds?ids=${projectIds.join(',')}`);
    const projects = data.map(project => ProjectModel(project).update(project).asProps());
    this.setState({projects});
  }
  
  componentDidMount() {
    this.load();
  }
  
  render() {
    return (
      <PopoverContainer>
        {({visible, togglePopover}) => (
          <div className="button-wrap">
            <button className="button-small" data-track="open new-project pop" onClick={togglePopover}>New Project</button>
            {visible && <NewProjectPop projects={this.state.projects}/>}
          </div>
        )}
      </PopoverContainer>
    );
  }
}

NewProjectPopContainer.propTypes = {
  api: PropTypes.any.isRequired,
};

export default NewProjectPopContainer;