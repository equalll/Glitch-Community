/* global analytics */

import React from 'react';
import PropTypes from 'prop-types';

import Link from '../includes/link.jsx';
import Loader from '../includes/loader.jsx';
import ProjectResultItem from '../includes/project-result-item.jsx';
import PopoverWithButton from './popover-with-button';
import {getRemixUrl} from '../../models/project';

const NewProjectPop = ({projects}) => (
  <div className="pop-over new-project-pop">
    <section className="pop-over-actions results-list">
      <div className="results">
        {projects.length ? projects.map((project) => (
          <Link key={project.id} to={getRemixUrl(project.domain)}>
            <ProjectResultItem {...project} cdnUrl="https://cdn.glitch.com" users={[]} action={()=>{
              analytics.track("New Project Clicked", {
                baseDomain: project.domain,
                origin: "community new project pop",
              });
            }} />
          </Link>
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

class NewProjectPopButton extends React.Component {
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
    // always request against the production API, with no token
    const {data} = await this.props.api.get(
      `https://api.glitch.com/projects/byIds?ids=${projectIds.join(',')}`,
      {
        headers: {
          Authorization: ''
        },
      },
    );
    this.setState({projects: data});
  }
  
  componentDidMount() {
    this.load();
  }
  
  render() {
    return (<PopoverWithButton 
              buttonClass='button'
              buttonText='New Project'
              dataTrack="open new-project pop">
      <NewProjectPop projects={this.state.projects}/>
    </PopoverWithButton>);
  }
}
NewProjectPopButton.propTypes = {
  api: PropTypes.any.isRequired,
};

export default NewProjectPopButton;
