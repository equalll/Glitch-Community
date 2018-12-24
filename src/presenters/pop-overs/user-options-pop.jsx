import React from 'react';
import PropTypes from 'prop-types';

import {getAvatarUrl as getTeamAvatarUrl} from '../../models/team';
import {getAvatarThumbnailUrl as getUserAvatarUrl} from '../../models/user';
import {TrackClick} from '../analytics';
import {Link, TeamLink, UserLink} from '../includes/link.jsx';
import PopoverContainer from './popover-container.jsx';
import {NestedPopover} from './popover-nested.jsx';
import CreateTeamPop from './create-team-pop.jsx';

import {orderBy} from 'lodash';

// Create Team button

const CreateTeamButton = ({showCreateTeam, userIsAnon}) => {
  if (userIsAnon) {
    return (
      <>
        <p className="description action-description">
          <button onClick={showCreateTeam} className="button-unstyled link">Sign in</button> to create teams
        </p>
        <button className="button button-small has-emoji" disabled>
          Create Team <span className="emoji herb" />
        </button>
      </>
    );
  }
  return (
    <TrackClick name="Create Team clicked">
      <button onClick={showCreateTeam} className="button button-small has-emoji">
        Create Team <span className="emoji herb" />
      </button>
    </TrackClick>
  );
};

CreateTeamButton.propTypes = {
  showCreateTeam: PropTypes.func.isRequired,
  userIsAnon: PropTypes.bool.isRequired,
};


// Team List

const TeamList = ({teams, showCreateTeam, userIsAnon}) => {
  const orderedTeams = orderBy(teams, team => team.name.toLowerCase());
  
  return (
    <section className="pop-over-actions">
      { orderedTeams.map(team => (
        <div className="button-wrap" key={team.id}>
          <TeamLink key={team.id} team={team} className="button button-small has-emoji button-tertiary">
            {team.name}&nbsp;
            <img className="emoji avatar" src={getTeamAvatarUrl({...team, size:'small'})} alt="" width="16px" height="16px"/>
          </TeamLink>
        </div>
      ))}
      <CreateTeamButton showCreateTeam={showCreateTeam} userIsAnon={userIsAnon} />
    </section>
  );
};

TeamList.propTypes = {
  teams: PropTypes.arrayOf(PropTypes.shape({
    hasAvatarImage: PropTypes.bool.isRequired,
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  })),
  showCreateTeam: PropTypes.func.isRequired,
  userIsAnon: PropTypes.bool.isRequired,
};


// User Options 🧕

const UserOptionsPop = ({
  togglePopover,
  showCreateTeam,
  user,
  signOut,
  showNewStuffOverlay,
}) => {
  const clickNewStuff = (event) => {
    togglePopover();
    showNewStuffOverlay();
    event.stopPropagation();
  };
  
  const clickSignout = () => {
    if(!user.login) {
      if(!window.confirm(`You won't be able to sign back in under this same anonymous account.
Are you sure you want to sign out?`)) {
        return;
      }
    }
    togglePopover();
    /* global analytics */
    analytics.track("Logout");
    analytics.reset();
    signOut();
  };
  
  const userName = user.name || "Anonymous";
  const userAvatarStyle = {backgroundColor: user.color};

  return (
    <dialog className="pop-over user-options-pop">
      <UserLink user={user} className="user-info">
        <section className="pop-over-actions user-info">
          <img className="avatar" src={getUserAvatarUrl(user)} alt="Your avatar" style={userAvatarStyle}/>
          <div className="info-container">
            <p className="name" title={userName}>{userName}</p>
            { user.login &&
              <p className="user-login" title={user.login}>@{user.login}</p>
            }
          </div>
        </section>
      </UserLink>
      <TeamList 
        teams={user.teams} 
        showCreateTeam={showCreateTeam} 
        userIsAnon={!user.login} 
      />
      <section className="pop-over-info">
        <button onClick={clickNewStuff} className="button-small has-emoji button-tertiary button-on-secondary-background">
          New Stuff <span className="emoji dog-face"></span>
        </button>
        <Link to="https://support.glitch.com" className="button button-small has-emoji button-tertiary button-on-secondary-background">
          Support <span className="emoji ambulance"></span>
        </Link>
        <button onClick={clickSignout} className="button-small has-emoji button-tertiary button-on-secondary-background">
          Sign Out <span className="emoji balloon"></span>
        </button>
      </section>
    </dialog>
  );
};

UserOptionsPop.propTypes = {
  togglePopover: PropTypes.func.isRequired,
  showCreateTeam: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  signOut: PropTypes.func.isRequired,
  showNewStuffOverlay: PropTypes.func.isRequired,
};

class CheckForCreateTeamHash extends React.Component {
  constructor(props) {
    super(props);
    this.state = {active: window.location.hash === '#create-team'};
  }
  componentDidMount() {
    this.setState({active: false});
  }
  render() {
    return this.props.children(this.state.active);
  }
}


// Header button and init pop

export default function UserOptionsAndCreateTeamPopContainer(props) {
  const avatarUrl = getUserAvatarUrl(props.user);
  const avatarStyle = {backgroundColor: props.user.color};
  return (
    <CheckForCreateTeamHash>
      {createTeamOpen => (
        <PopoverContainer startOpen={createTeamOpen}>
          {({togglePopover, visible}) => (
            <div className="button user-options-pop-button" data-tooltip="User options" data-tooltip-right="true">
              <button className="user" onClick={togglePopover} disabled={!props.user.id}>
                <img className="user-avatar" src={avatarUrl} style={avatarStyle} width="30px" height="30px" alt="User options"/>
                <span className="down-arrow icon"/>
              </button>
              {visible && (
                <NestedPopover alternateContent={() => <CreateTeamPop {...props}/>} startAlternateVisible={createTeamOpen}>
                  {showCreateTeam => <UserOptionsPop {...props} {...{togglePopover, showCreateTeam}}/>}
                </NestedPopover>
              )}
            </div>
          )}
        </PopoverContainer>
      )}
    </CheckForCreateTeamHash>
  );
}

UserOptionsAndCreateTeamPopContainer.propTypes = {
  user: PropTypes.shape({
    avatarThumbnailUrl: PropTypes.string,
    color: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    login: PropTypes.string,
    teams: PropTypes.array.isRequired,
  }).isRequired,
  api: PropTypes.func.isRequired,
};
