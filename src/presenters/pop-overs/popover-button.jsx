import React from 'react';
import PropTypes from 'prop-types';

const PopoverButton = ({onClick, text, emoji}) => (
  <button className="button-small has-emoji button-tertiary" onClick={onClick}>
    <span>{text} </span>
    <span className={`emoji ${emoji}`}></span>
  </button>
);

PopoverButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  text: PropTypes.node.isRequired,
  emoji: PropTypes.string.isRequired,
};

export default PopoverButton;

