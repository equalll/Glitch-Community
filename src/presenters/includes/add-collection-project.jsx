import React from 'react';
import PropTypes from 'prop-types';

import AddCollectionProjectPop from '../pop-overs/add-collection-project-pop.jsx';
import PopoverWithButton from '../pop-overs/popover-with-button';
import PopoverContainer from '../pop-overs/popover-container.jsx';

const AddCollectionProject = ({currentUserIsOwner, ...props}) => {
  if(!currentUserIsOwner) {
    return null;
  }
  
  return (
    <PopoverContainer>
      {({visible, togglePopover}) => (
        <div className="button-wrap">
          <button className={`button add-project opens-pop-over`} onClick={togglePopover}>
              Add Project
          </button>
          { visible && <AddCollectionProjectPop {...props} togglePopover={togglePopover} /> }
        </div>
      )}
    </PopoverContainer>
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
