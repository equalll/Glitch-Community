import React from 'react';
import PropTypes from 'prop-types';
import ProjectResultItem from '../includes/project-result-item.jsx';
import PopoverContainer from './popover-container.jsx';

<<<<<<< HEAD
=======
import ProjectModel, {getRemixUrl} from '../../models/project';

>>>>>>> 179d7950bb1126424694bb2f6b1ed428e38fc033
const NewProjectPop = ({projects}) => (
  <div className="pop-over new-project-pop">
    <section className="pop-over-actions results-list">
      <div className="results">
<<<<<<< HEAD
        { projects.map((project) => (
          <a key={project.id} href={project.remixUrl}>
            <ProjectResultItem {...project} action={()=>{
=======
        {projects.length ? projects.map((project) => (
          <a key={project.id} href={getRemixUrl(project.domain)}>
            <ProjectResultItem {...project} users={[]} action={()=>{
>>>>>>> 179d7950bb1126424694bb2f6b1ed428e38fc033
              /* global analytics */
              analytics.track("New Project Clicked", {
                baseDomain: project.domain,
                origin: "community new project pop",
              });
            }} />
          </a>
        ))}
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
  
  componentDidMount() {
    const projectIds = [
      'a0fcd798-9ddf-42e5-8205-17158d4bf5bb', // 'hello-express'
      'cb519589-591c-474f-8986-a513f22dbf88', // 'hello-sqlite'
      '929980a8-32fc-4ae7-a66f-dddb3ae4912c', // 'hello-webpage'
    ];
    this.props.promiseProjectsByIds(projectIds).then((projects) => {
      const projectProps = projects.map((project) => {
        const {...props} = project.asProps();
        //Deliberately hide the user list 
        props.users = [];
        return props;
      });
      
      this.setState({projects: projectProps});
    });
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
  promiseProjectsByIds: PropTypes.func.isRequired,
};

export default NewProjectPopContainer;
