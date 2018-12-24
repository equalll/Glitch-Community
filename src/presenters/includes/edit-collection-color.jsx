import React from 'react';
import PropTypes from 'prop-types';

import EditCollectionColorPop from '../pop-overs/edit-collection-color-pop.jsx';
import PopoverWithButton from '../pop-overs/popover-with-button';
import PopoverContainer from '../pop-overs/popover-container.jsx';

const EditCollectionColor = ({update, initialColor, ...props}) => {  
  return (
    <PopoverWithButton 
      containerClass="edit-collection-color-btn"
      buttonClass="button add-project opens-pop-over" buttonText="Color"
      passToggleToPop >
      <EditCollectionColorPop {...props} updateColor={update} initialColor={initialColor}/>
    </PopoverWithButton>
  );
};

export default EditCollectionColor;

EditCollectionColor.propTypes = {
  update: PropTypes.func.isRequired,
  initialColor: PropTypes.string.isRequired,
};