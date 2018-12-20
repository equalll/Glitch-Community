import React from 'react';
import PropTypes from 'prop-types';

const compass = "https://cdn.glitch.com/bc50f686-4c0a-4e20-852f-3999b29e8092%2Fcompass.svg?1545073264846";
const needle = "https://cdn.glitch.com/bc50f686-4c0a-4e20-852f-3999b29e8092%2Fneedle.svg?1545073265096";

const NotFound = ({name}) => (
  <section>
    <p>We didn't find {name}</p>
    <div className="error-image">
      <img className="compass" src={compass} alt=""/>
      <img className="needle" src={needle} alt=""/>
    </div>  
    
  </section>
);

NotFound.propTypes = {
  name: PropTypes.string.isRequired
};


export default NotFound;
