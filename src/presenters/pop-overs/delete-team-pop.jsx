import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
//import UsersList from '../users-list.jsx';
import Loader from '../includes/loader.jsx';
import NotificationsConsumer from '../notifications.jsx';

class DeleteTeamPopBase extends React.Component {
  constructor(props) {
    super(props);    
    this.state = {
      teamIsDeleting: false,
    };
    this.deleteTeam = this.deleteTeam.bind(this);
  }
    
  async deleteTeam() {
    if (this.state.teamIsDeleting) {
      return null;
    }
    this.setState({
      teamIsDeleting: true
    });
    try {
      await this.props.api().delete(`teams/${this.props.teamId}`);
      this.props.history.push('/');
    } catch (error) {
      console.error("deleteTeam", error, error.response);
      this.props.createErrorNotification('Something went wrong, try refreshing?');
      this.setState({
        teamIsDeleting: false
      });
    }
  }
    
  render() {
    let illustration = "https://cdn.glitch.com/c53fd895-ee00-4295-b111-7e024967a033%2Fdelete-team.svg?1531267699621";
    return (
      <dialog className="pop-over delete-team-pop" open>
        <section className="pop-over-info">
          <div className="pop-title">
            Delete {this.props.teamName}
          </div>
        </section>
        <section className="pop-over-actions">
          <img className="illustration" src={illustration} aria-label="illustration" alt="" />
          <div className="action-description">
            Deleting {this.props.teamName} will remove this team page. No projects will be deleted, but only current project members will be able to edit them.
          </div>
        </section>
        <section className="pop-over-actions danger-zone">
          <button className="button button-small has-emoji opens-pop-over" onClick={this.deleteTeam}>
            <span>Delete {this.props.teamName} </span> 
            <span className="emoji bomb" role="img" aria-label="bomb emoji"></span>
            { this.state.teamIsDeleting && <Loader /> }
          </button>
        </section>
        
        {/* temp hidden until the email part of this is ready
        <section className="pop-over-info">
          <UsersList users={this.props.teamAdmins}/>
          <p className="info-description">This will also email all team admins, giving them an option to undelete it later</p>
        </section>
         */}

      </dialog>
    );
  }
}

export const DeleteTeamPop = withRouter(props => (
  <NotificationsConsumer>
    {notifyFuncs => <DeleteTeamPopBase {...notifyFuncs} {...props}/>}
  </NotificationsConsumer>
));

DeleteTeamPop.propTypes = {
  api: PropTypes.func.isRequired,
  teamId: PropTypes.number.isRequired,
  teamName: PropTypes.string.isRequired,
  users: PropTypes.array.isRequired,
  teamAdmins: PropTypes.array.isRequired,
  togglePopover: PropTypes.func.isRequired,
};

export default DeleteTeamPop;
