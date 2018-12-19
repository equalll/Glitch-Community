import React from 'react';
import PropTypes from 'prop-types';

const {Provider, Consumer} = React.createContext();

export class NestedPopover extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      alternateContentVisible: props.startAlternateVisible,
    };
    this.toggle = this.toggle.bind(this);
  }
  
  toggle() {
    this.setState(prevState => ({alternateContentVisible: !prevState.alternateContentVisible}));
  }
  
  render() {
    // Only use the provider on the sub menu
    // Nested consumers want the back button, not the open menu
    if (this.state.alternateContentVisible) {
      return (
        <Provider value={this.toggle}>
          {this.props.alternateContent(this.toggle)}
        </Provider>
      );
    }
    return this.props.children(this.toggle);
  }
}
NestedPopover.propTypes = {
  children: PropTypes.func.isRequired,
  alternateContent: PropTypes.func.isRequired,
  startAlternateVisible: PropTypes.bool,
};
NestedPopover.defaultProps = {
  startAlternateVisible: false,
};


export const NestedPopoverTitle = ({children}) => (
  <Consumer>
    {toggle => (
      <button className="button-unstyled pop-over-section pop-over-info clickable-label" onClick={toggle} aria-label="go back">
        <div className="back icon"><div className="left-arrow icon" /></div>
        &nbsp;
        <div className="pop-title">{children}</div>
      </button>
    )}
  </Consumer>
);
NestedPopoverTitle.propTypes = {
  children: PropTypes.node.isRequired,
};