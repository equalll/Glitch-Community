import React from 'react';
import PropTypes from 'prop-types';

import DeleteTeamPop from '../pop-overs/delete-team-pop.jsx';
import PopoverContainer from '../pop-overs/popover-container.jsx';

const DeleteTeam = ({...props}) => {
  
  return (
    <section>
      <PopoverContainer>
        {({visible, togglePopover}) => (
          <div className="button-wrap">
            <button className="button button-small button-tertiary has-emoji opens-pop-over danger-zone" onClick={togglePopover}>
              Delete {props.teamName}&nbsp;
              <span className="emoji bomb" role="img" aria-label="" />
            </button>
            { visible && <DeleteTeamPop {...props} togglePopover={togglePopover} /> }
          </div>
        )}
      </PopoverContainer>
    </section>
  );
};

DeleteTeam.propTypes = {
  api: PropTypes.func.isRequired,
  teamId: PropTypes.number.isRequired,
  teamName: PropTypes.string.isRequired,
  users: PropTypes.array.isRequired,
  teamAdmins: PropTypes.array.isRequired,
};

export default DeleteTeam;
