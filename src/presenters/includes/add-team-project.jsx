import React from 'react';
import PropTypes from 'prop-types';

import AddTeamProjectPop from '../pop-overs/add-team-project-pop.jsx';
import PopoverWithButton from '../pop-overs/popover-with-button';

const AddTeamProject = ({ currentUserIsOnTeam, ...props }) => {
  if (!currentUserIsOnTeam) {
    return null;
  }

  return (
    <section className="add-project-container">
      {/* Add disabled={props.projectLimitIsReached} to button once billing is ready */}
      <PopoverWithButton
        buttonClass={`button add-project has-emoji opens-pop-over ${props.extraButtonClass}`}
        buttonText={<>Add Project <span className="emoji bento-box" role="img" aria-label="" /></>}
        passToggleToPop
      >
        <AddTeamProjectPop {...props} />
      </PopoverWithButton>
    </section>
  );
};

AddTeamProject.propTypes = {
  currentUserIsOnTeam: PropTypes.bool.isRequired,
  addProject: PropTypes.func.isRequired,
  teamProjects: PropTypes.array.isRequired,
  extraButtonClass: PropTypes.string,
  api: PropTypes.func.isRequired
};

export default AddTeamProject;
