import React from 'react';
import PropTypes from 'prop-types';

import AddCollectionProjectPop from '../pop-overs/add-collection-project-pop.jsx';
import PopoverWithButton from '../pop-overs/popover-with-button';

const AddCollectionProject = ({currentUserIsOwner, ...props}) => {
  if(!currentUserIsOwner) {
    return null;
  }
  
  return (
    <PopoverWithButton
      buttonClass="button add-project opens-pop-over"
      buttonText="Add Project"
      passToggleToPop
    >
      {/* togglePopover is a placeholder here - the real value will be passed by PopoverWithButton */ }
      <AddCollectionProjectPop {...props} togglePopover={() => {}} />
    </PopoverWithButton>
  );
};

AddCollectionProject.propTypes = {
  currentUserIsOwner: PropTypes.bool.isRequired,
  collection: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  addProjectToCollection: PropTypes.func.isRequired,
  api: PropTypes.func.isRequired
};

export default AddCollectionProject;
