/* global Set */

import React from 'react';
import PropTypes from 'prop-types';

import {TrackClick} from '../analytics';
import Loader from '../includes/loader.jsx';
import NotificationsConsumer from '../notifications.jsx';
import {NestedPopoverTitle} from './popover-nested.jsx';
import {getAvatarThumbnailUrl, getDisplayName} from '../../models/user';
import {getAvatarUrl as getProjectAvatarUrl} from  '../../models/project';

class TeamUserRemovePopBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gettingUser: true,
      userTeamProjects: [],
      selectedProjects: new Set(),
    };
    this.selectAllProjects = this.selectAllProjects.bind(this);
    this.unselectAllProjects = this.unselectAllProjects.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.removeUser = this.removeUser.bind(this);
  }
  
  removeUser() {
    this.props.togglePopover();
    this.props.createNotification(`${getDisplayName(this.props.user)} removed from Team`);
    this.props.removeUserFromTeam(this.props.user.id, Array.from(this.state.selectedProjects));
  }
  
  selectAllProjects() {
    this.setState(({userTeamProjects}) => ({
      selectedProjects: new Set(userTeamProjects.map(p => p.id))
    }));
  }
  
  unselectAllProjects() {
    this.setState({
      selectedProjects: new Set()
    });
  }
  
  handleCheckboxChange(evt) {
    const {checked, value} = evt.target;
    this.setState(({selectedProjects}) => {
      selectedProjects = new Set(selectedProjects);
      if (checked) {
        selectedProjects.add(value);
      } else {
        selectedProjects.delete(value);
      }
      return {selectedProjects};
    });
  }
  
  async getUserWithProjects() {
    const {data} = await this.props.api.get(`users/${this.props.user.id}`);
    this.setState({
      userTeamProjects: data.projects.filter(userProj => {
        return this.props.team.projects.some(teamProj => teamProj.id === userProj.id);
      }),
      gettingUser: false
    });
  }
  
  componentDidMount() {
    this.getUserWithProjects();    
  }
  
  render() {
    const allProjectsSelected = this.state.userTeamProjects.every(p => this.state.selectedProjects.has(p.id));
    const userAvatarStyle = {backgroundColor: this.props.user.color};
    
    let projects = null;
    if (this.state.gettingUser) {
      projects = <Loader/>;
    } else if (this.state.userTeamProjects.length > 0) {
      projects = (
        <>
          <p className="action-description">
            Also remove them from these projects
          </p>
          <div className="projects-list">
            { this.state.userTeamProjects.map(project => (
              <label key={project.id} htmlFor={`remove-user-project-${project.id}`}>
                <input className="checkbox-project" type="checkbox" id={`remove-user-project-${project.id}`}
                  checked={this.state.selectedProjects.has(project.id)} value={project.id}
                  onChange={this.handleCheckboxChange}
                />
                <img className="avatar" src={getProjectAvatarUrl(project.id)} alt=""/>
                {project.domain}
              </label>
            ))}
          </div>
          {this.state.userTeamProjects.length > 1 && (
            <button className="button-small"
              onClick={allProjectsSelected ? this.unselectAllProjects : this.selectAllProjects}
            >
              {allProjectsSelected ? 'Unselect All' : 'Select All'}
            </button>
          )}
        </>
      );
    }
    
    return (
      <dialog className="pop-over team-user-info-pop team-user-remove-pop">
        <NestedPopoverTitle>
          Remove {getDisplayName(this.props.user)}
        </NestedPopoverTitle>
        
        <section className="pop-over-actions" id="user-team-projects">
          {projects || (
            <p className="action-description">
              {getDisplayName(this.props.user)} is not a member of any projects
            </p>
          )}
        </section>
        
        <section className="pop-over-actions danger-zone">
          <TrackClick name="Remove from Team submitted">
            <button className="button-small has-emoji" onClick={this.removeUser}>
              Remove <img className="emoji avatar" src={getAvatarThumbnailUrl(this.props.user)} alt={this.props.user.login} style={userAvatarStyle}/>
            </button>
          </TrackClick>
        </section>
      </dialog>
    );
  }
}
TeamUserRemovePopBase.propTypes = {
  api: PropTypes.func.isRequired,
  user: PropTypes.shape({
    name: PropTypes.string,
    login: PropTypes.string,
    thanksCount: PropTypes.number.isRequired,
    isOnTeam: PropTypes.bool,
    color: PropTypes.string,
  }).isRequired,
  team: PropTypes.shape({
    projects: PropTypes.array.isRequired
  }),
  removeUserFromTeam: PropTypes.func.isRequired,
  createNotification: PropTypes.func.isRequired,
};

export const TeamUserRemovePop = (props) => (
  <NotificationsConsumer>
    {notifyFuncs => <TeamUserRemovePopBase {...notifyFuncs} {...props}/>}
  </NotificationsConsumer>
);

export default TeamUserRemovePop;