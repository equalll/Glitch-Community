import React from 'react';
import PropTypes from 'prop-types';

import EditCollectionColorPop from '../pop-overs/edit-collection-color-pop.jsx';
import PopoverWithButton from '../pop-overs/popover-with-button';

const EditCollectionColor = ({ update, initialColor, ...props }) => (
  <PopoverWithButton
    buttonText="Color"
    buttonClass="edit-collection-color-btn"
    passToggleToPop
  >
    <EditCollectionColorPop
      {...props}
      updateColor={update}
      initialColor={initialColor}
    />
  </PopoverWithButton>
);

export default EditCollectionColor;

EditCollectionColor.propTypes = {
  update: PropTypes.func.isRequired,
  initialColor: PropTypes.string.isRequired
};
