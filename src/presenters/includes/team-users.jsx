import React from 'react';
import PropTypes from 'prop-types';

import {getDisplayName} from '../../models/user';
import {TrackClick} from '../analytics';
import {WhitelistedDomainIcon} from './team-elements.jsx';
import AddTeamUserPop from '../pop-overs/add-team-user-pop.jsx';
import PopoverContainer from '../pop-overs/popover-container.jsx';
import TeamUserInfoPop from '../pop-overs/team-user-info-pop.jsx';
import UsersList from '../users-list.jsx';
import {UserPopoversList} from '../users-list.jsx';


// Team Users list (in profile container)

export const TeamUsers = (props) => (
  <UserPopoversList users={props.users} adminIds={props.adminIds}>
    {(user, togglePopover) =>
      <TeamUserInfoPop
        userIsTeamAdmin={props.adminIds.includes(user.id)}
        userIsTheOnlyMember={props.users.length === 1}
        user={user} togglePopover={togglePopover}
        {...props}
      />
    }
  </UserPopoversList>
);

TeamUsers.propTypes = {
  users: PropTypes.array.isRequired,
  currentUserIsOnTeam: PropTypes.bool.isRequired,
  removeUserFromTeam: PropTypes.func.isRequired,
  updateUserPermissions: PropTypes.func.isRequired,
  api: PropTypes.func.isRequired,
  teamId: PropTypes.number.isRequired,
  currentUserIsTeamAdmin: PropTypes.bool.isRequired,
  adminIds: PropTypes.array.isRequired,
  team: PropTypes.object.isRequired,
};


// Whitelisted domain icon

export const WhitelistedDomain = ({domain, setDomain}) => {
  const tooltip = `Anyone with an @${domain} email can join`;
  return (
    <PopoverContainer>
      {({visible, setVisible}) => (
        <details onToggle={evt => setVisible(evt.target.open)} open={visible} className="popover-container whitelisted-domain-container">
          <summary data-tooltip={!visible ? tooltip : null}>
            <WhitelistedDomainIcon domain={domain}/>
          </summary>
          <dialog className="pop-over">
            <section className="pop-over-info">
              <p className="info-description">
                {tooltip}
              </p>
            </section>
            {!!setDomain && (
              <section className="pop-over-actions danger-zone">
                <button className="button button-small button-tertiary button-on-secondary-background has-emoji" onClick={() => setDomain(null)}>
                  Remove {domain} <span className="emoji bomb"></span>
                </button>
              </section>
            )}
          </dialog>
        </details>
      )}
    </PopoverContainer>
  );
};

WhitelistedDomain.propTypes = {
  domain: PropTypes.string.isRequired,
  setDomain: PropTypes.func,
};


// Add Team User

export class AddTeamUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      invitee: '',
      alreadyInvited: [],
    };
    this.removeNotifyInvited = this.removeNotifyInvited.bind(this);
  }
  
  async setWhitelistedDomain(togglePopover, domain) {
    togglePopover();
    await this.props.setWhitelistedDomain(domain);
  }
  
  async inviteUser(togglePopover, user) {
    togglePopover();
    this.setState((state) => ({
      invitee: getDisplayName(user),
      alreadyInvited: [...state.alreadyInvited, user],
    }));
    await this.props.inviteUser(user);
  }
  
  async inviteEmail(togglePopover, email) {
    togglePopover();
    this.setState({
      invitee: email,
    });
    await this.props.inviteEmail(email);
  }

  removeNotifyInvited() {
    this.setState({
      invitee: '',
    });
  }

  render() {
    const {inviteEmail, inviteUser, setWhitelistedDomain, ...props} = this.props;
    return (
      <PopoverContainer>
        {({visible, togglePopover}) => (
          <span className="add-user-container">
            {!!this.state.alreadyInvited.length && 
              <UsersList users={this.state.alreadyInvited}/>
            }
            <TrackClick name="Add to Team clicked">
              <button onClick={togglePopover} className="button button-small button-tertiary add-user">Add</button>
            </TrackClick>
            {!!this.state.invitee &&
              <div className="notification notifySuccess inline-notification" onAnimationEnd={this.removeNotifyInvited}>
                Invited {this.state.invitee}
              </div>
            }
            {visible && 
              <AddTeamUserPop 
                {...props}
                setWhitelistedDomain={setWhitelistedDomain ? domain => this.setWhitelistedDomain(togglePopover, domain) : null}
                inviteUser={inviteUser ? user => this.inviteUser(togglePopover, user) : null}
                inviteEmail={inviteEmail ? email => this.inviteEmail(togglePopover, email) : null}
              />
            }
          </span>
        )}
      </PopoverContainer>
    );
  }
}
AddTeamUser.propTypes = {
  inviteEmail: PropTypes.func,
  inviteUser: PropTypes.func,
  setWhitelistedDomain: PropTypes.func,
};

// Join Team

export const JoinTeam = ({onClick}) => (
  <button className="button button-small button-cta join-team-button" onClick={onClick}>
    Join Team
  </button>
);