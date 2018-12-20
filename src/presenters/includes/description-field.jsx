import React from 'react';
import PropTypes from 'prop-types';
import TextArea from 'react-textarea-autosize';

import Markdown from './markdown.jsx';
import {OptimisticValue} from './field-helpers.jsx';

class EditableDescriptionImpl extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      focused: false,
    };
    
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }
  
  onFocus(event) {
    if (event.currentTarget === event.target) {
      this.setState({focused: true});
    }
  }
  
  onBlur() {
    this.setState({focused: false});
  }
  
  render() {
    const {description, placeholder} = this.props;
    return (this.state.focused
      ?
      <TextArea
        className="description content-editable"
        value={description}
        onChange={evt => this.props.update(evt.target.value)}
        onFocus={this.onFocus} onBlur={this.onBlur}
        placeholder={placeholder}
        spellCheck={false}
        autoFocus // eslint-disable-line jsx-a11y/no-autofocus
      />
      :
      <p
        className="description content-editable"
        placeholder={placeholder} aria-label={placeholder}
        role="textbox" // eslint-disable-line jsx-a11y/no-noninteractive-element-to-interactive-role
        tabIndex={0} onFocus={this.onFocus} onBlur={this.onBlur}
      >
        <Markdown>{description}</Markdown>
      </p>
    );
  }
}
EditableDescriptionImpl.propTypes = {
  description: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  update: PropTypes.func.isRequired,
};

const EditableDescription = ({description, placeholder, update}) => (
  <OptimisticValue value={description} update={update}>
    {({value, update}) => (
      <EditableDescriptionImpl description={value} update={update} placeholder={placeholder}/>
    )}
  </OptimisticValue>
);
EditableDescription.propTypes = {
  description: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  update: PropTypes.func.isRequired,
};

export const StaticDescription = ({description}) => (
  description ? 
    <p className="description read-only">
      <Markdown>{description}</Markdown>
    </p> 
    : null
);
StaticDescription.propTypes = {
  description: PropTypes.string.isRequired,
};

export const AuthDescription = ({authorized, description, placeholder, update}) => (
  authorized ?
    <EditableDescription 
      description={description} 
      update={update} 
      placeholder={placeholder} 
    /> 
    :
    <StaticDescription description={description}/>
);
AuthDescription.propTypes = {
  authorized: PropTypes.bool.isRequired,
  description: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  update: PropTypes.func.isRequired,
};

