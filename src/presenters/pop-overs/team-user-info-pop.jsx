import React from 'react';
import PropTypes from 'prop-types';

import {getAvatarThumbnailUrl} from '../../models/user';

import {NestedPopover} from './popover-nested.jsx';
import {UserLink} from '../includes/link.jsx';
import Thanks from '../includes/thanks.jsx';

import TeamUserRemovePop from './team-user-remove-pop.jsx';

const MEMBER_ACCESS_LEVEL = 20;
const ADMIN_ACCESS_LEVEL = 30;

// Remove from Team 👋

const RemoveFromTeam = (props) => (
  <section className="pop-over-actions danger-zone">
    <button className="button-small has-emoji button-tertiary button-on-secondary-background" {...props}>
      Remove from Team <span className="emoji wave" role="img" aria-label=""/>
    </button>
  </section>
);


// Admin Actions Section ⏫⏬

const AdminActions = ({user, userIsTeamAdmin, updateUserPermissions}) => {
  return (
    <section className="pop-over-actions admin-actions">
      <p className="action-description">
        Admins can update team info, billing, and remove users
      </p>
      { userIsTeamAdmin ? (
        <button className="button-small button-tertiary has-emoji" onClick={() => updateUserPermissions(user.id, MEMBER_ACCESS_LEVEL)}>
          Remove Admin Status <span className="emoji fast-down" />
        </button>
      ) : (
        <button className="button-small button-tertiary has-emoji" onClick={() => updateUserPermissions(user.id, ADMIN_ACCESS_LEVEL)}>
          Make an Admin <span className="emoji fast-up" />
        </button>
      )}
    </section>
  );
};

AdminActions.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired,
  userIsTeamAdmin: PropTypes.bool.isRequired,
  updateUserPermissions: PropTypes.func.isRequired,
};


// Thanks 💖

const ThanksCount = ({count}) => (
  <section className="pop-over-info">
    <Thanks count={count} />
  </section>
);


// Team User Info 😍

const TeamUserInfo = ({currentUser, showRemove, ...props}) => {
  const userAvatarStyle = {backgroundColor: props.user.color};
  const canRemoveUser = props.currentUserIsTeamAdmin || (currentUser && currentUser.id === props.user.id);
  return (
    <dialog className="pop-over team-user-info-pop">
      <section className="pop-over-info user-info">
        <UserLink user={props.user}>
          <img className="avatar" src={getAvatarThumbnailUrl(props.user)} alt={props.user.login} style={userAvatarStyle}/>
        </UserLink>
        <div className="info-container">
          <p className="name" title={props.user.name}>{props.user.name || "Anonymous"}</p>
          { props.user.login &&
            <p className="user-login" title={props.user.login}>@{props.user.login}</p>
          }
          { props.userIsTeamAdmin && 
            <div className="status-badge">
              <span className="status admin" data-tooltip="Can edit team info and billing">
                Team Admin
              </span>
            </div>
          }
        </div>
      </section>
      { props.user.thanksCount > 0 && <ThanksCount count={props.user.thanksCount} /> }
      { props.currentUserIsTeamAdmin &&
        <AdminActions 
          user={props.user}
          userIsTeamAdmin={props.userIsTeamAdmin}
          updateUserPermissions={props.updateUserPermissions}
        />
      }
      { canRemoveUser && !props.userIsTheOnlyMember && <RemoveFromTeam onClick={showRemove}/> }
    </dialog>
  );
};


// Team User Remove 💣


// Team User Info or Remove
// uses removeTeamUserVisible state to toggle between showing user info and remove views

const TeamUserInfoAndRemovePop = (props) => (
  <NestedPopover alternateContent={() => <TeamUserRemovePop {...props}/>}>
    {showRemove => (
      <TeamUserInfo {...props} showRemove={showRemove}/>
    )}
  </NestedPopover>
);

TeamUserInfoAndRemovePop.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    login: PropTypes.string,
    thanksCount: PropTypes.number.isRequired,
    color: PropTypes.string,
  }).isRequired,
  currentUserIsOnTeam: PropTypes.bool.isRequired,
  currentUserIsTeamAdmin: PropTypes.bool.isRequired,
  removeUserFromTeam: PropTypes.func.isRequired,
  userIsTeamAdmin: PropTypes.bool.isRequired,
  userIsTheOnlyMember: PropTypes.bool.isRequired,
  api: PropTypes.func.isRequired,
  teamId: PropTypes.number.isRequired,
  updateUserPermissions: PropTypes.func.isRequired,
  team: PropTypes.shape({
    projects: PropTypes.array.isRequired,
  }),
};

TeamUserInfoAndRemovePop.defaultProps = {
  currentUserIsOnTeam: false,
};

export default TeamUserInfoAndRemovePop;