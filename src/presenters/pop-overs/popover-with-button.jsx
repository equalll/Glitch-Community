import React from 'react';
import PropTypes from 'prop-types';
import PopoverContainer from './popover-container.jsx';

const PopoverWithButton = props => {
  return (
    <PopoverContainer>
      {({ visible, togglePopover }) => {
        let childrenToShow = props.children;
        if (props.passToggleToPop) {
          childrenToShow = React.Children.map(props.children, child => React.cloneElement(child, { togglePopover: togglePopover }));
        }
        return (
          <div className="button-wrap">
            <button
              className={"button-small " + props.buttonClass}
              data-track={props.dataTrack}
              onClick={togglePopover}
            >
              {props.buttonText}
            </button>
            {visible && childrenToShow}
          </div>
        );
      }}
    </PopoverContainer>
  );
};

PopoverWithButton.propTypes = {
  buttonClass: PropTypes.string,
  dataTrack: PropTypes.string,
  buttonText: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired, // should be the stuff to show in a popover
  passToggleToPop: PropTypes.bool
};

PopoverWithButton.defaultProps = {
  buttonClass: "",
  dataTrack: "",
  passToggleToPop: false
};

export default PopoverWithButton;
