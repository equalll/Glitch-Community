import React from 'react';
import PropTypes from 'prop-types';

import AddProjectToCollectionPop from '../pop-overs/add-project-to-collection-pop.jsx';
import PopoverContainer from '../pop-overs/popover-container.jsx';

const AddProjectToCollection = ({project, ...props}) => {
  
  return (
    <PopoverContainer>
      {({visible, togglePopover}) => (
        <div className="button-wrap">
          <button className={`button button-small has-emoji add-project opens-pop-over`} onClick={togglePopover}>
              Add to Collection {' '}
            <span className="emoji framed-picture" role="presentation"></span>
          </button>
          { visible && <AddProjectToCollectionPop {...props} project={project} togglePopover={togglePopover}/> }
        </div>
      )}
    </PopoverContainer>
  );
};

AddProjectToCollection .propTypes = {
  addProjectToCollection: PropTypes.func.isRequired,
  api: PropTypes.func.isRequired,
  project: PropTypes.object.isRequired,
};

export default AddProjectToCollection;
