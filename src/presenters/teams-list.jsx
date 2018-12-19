import React from 'react';
import PropTypes from 'prop-types';

import {TeamLink} from './includes/link.jsx';
import {TeamAvatar} from './includes/avatar.jsx';

export const TeamTile = ({team}) => (
  <TeamLink team={team} className="user">
    <TeamAvatar team={team}/>
  </TeamLink>
);

TeamTile.propTypes = {
  team: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
};

export const TeamsList = ({teams}) => (
  <ul className="users teams-information">
    {teams.map(team => (
      <li key={team.id}>
        <TeamTile team={team}/>
      </li>
    ))}
  </ul>
);

TeamsList.propTypes = {
  teams: PropTypes.array.isRequired,
};

export default TeamsList;