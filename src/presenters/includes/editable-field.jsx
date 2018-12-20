import React from 'react';
import PropTypes from 'prop-types';
import {uniqueId} from 'lodash';

import {OptimisticValue, TrimmedValue, FieldErrorIcon, FieldErrorMessage} from './field-helpers.jsx';

<<<<<<< HEAD

class PureEditableFieldHolder extends React.Component {
=======
export class PureEditableField extends React.Component {
>>>>>>> ab2770ac52a7f6fffa270223c76a58ec6e85838d
  constructor(props) {
    super(props);
    this.state = { id: uniqueId("editable-field-") };
    this.textInput = React.createRef();
    this.onChange = this.onChange.bind(this);
  }
  
  componentDidMount() {
    if (this.props.autoFocus) {
      this.textInput.current.select();
    }
  }
  
  onChange(evt) {
    this.props.update(evt.target.value);
  }
  
  render() {
    const classes = ["content-editable", this.props.error ? "error" : ""].join(" ");
    const inputProps = {
      id: this.state.id,
      className: classes,
      value: this.props.value,
      onChange: this.onChange,
      spellCheck: false,
      autoComplete: "off",
      placeholder: this.props.placeholder,
      autoFocus: this.props.autoFocus,
    };
    
    const maybeErrorIcon = !!this.props.error && <FieldErrorIcon/>;
    
    const maybeErrorMessage = !!this.props.error && <FieldErrorMessage error={this.props.error} hideIcon={true}/>;
    
    const maybePrefix = !!this.props.prefix && (
      <span className={"content-editable-affix " + classes}>{this.props.prefix}</span>
    );
    
    const maybeSuffix = !!this.props.suffix && (
      <span className={"content-editable-affix " + classes}>{this.props.suffix}</span>
    );
    
    return (
      <label htmlFor={inputProps.id}>
        <span className="editable-field-flex">
          {maybePrefix}
          <span className="editable-field-input">
            <input {...inputProps} ref={this.textInput} />
            {maybeErrorIcon}
          </span>
          {maybeSuffix}
        </span>
        {maybeErrorMessage}
      </label>
    );
  }
}
<<<<<<< HEAD

PureEditableFieldHolder.propTypes = {
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  update: PropTypes.func.isRequired,
  children: PropTypes.func.isRequired, // function that takes inputProps and inputRef as parameters and returns a node
  blur: PropTypes.func,
  prefix: PropTypes.node,
  suffix: PropTypes.node,
  autoFocus: PropTypes.bool,
  error: PropTypes.string,
};

export const PureEditableTextArea = (props) => (
  <PureEditableFieldHolder {...props}>
    {(inputProps, inputRef) => (
      <textarea {...inputProps} ref={inputRef} />  
    )}
  </PureEditableFieldHolder>
);

PureEditableTextArea.propTypes = {
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  update: PropTypes.func.isRequired,
  blur: PropTypes.func,
  prefix: PropTypes.node,
  suffix: PropTypes.node,
  autoFocus: PropTypes.bool,
  error: PropTypes.string,
  inputType: PropTypes.string,
};

export const PureEditableField = (props) => (
  <PureEditableFieldHolder {...props}>
    {(inputProps, inputRef) => (
      <input {...inputProps} ref={inputRef} />  
    )}
  </PureEditableFieldHolder>
);

=======
>>>>>>> ab2770ac52a7f6fffa270223c76a58ec6e85838d
PureEditableField.propTypes = {
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  update: PropTypes.func.isRequired,
  prefix: PropTypes.node,
  suffix: PropTypes.node,
  autoFocus: PropTypes.bool,
  error: PropTypes.string,
};

export const EditableField = ({value, update, ...props}) => (
  <OptimisticValue value={value} update={update} resetOnError={false}>
    {({value, update, error}) => (
      <TrimmedValue value={value} update={update}>
        {valueProps => (
          <PureEditableField {...props} {...valueProps} error={error}/>
        )}
      </TrimmedValue>
    )}
  </OptimisticValue>
);
EditableField.propTypes = {
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  update: PropTypes.func.isRequired,
  prefix: PropTypes.node,
  suffix: PropTypes.node,
  autoFocus: PropTypes.bool,
};

export default EditableField;