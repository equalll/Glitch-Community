import React from 'react';
import PropTypes from 'prop-types';
import onClickOutside from 'react-onclickoutside';
import {isFragment} from 'react-is';

/*
A popover is a light, hollow roll made from an egg batter similar to
that of Yorkshire pudding, typically baked in muffin tins or dedicated
popover pans, which have straight-walled sides rather than angled.

...also it's a [Bootstrap UI pattern](https://www.w3schools.com/bootstrap/bootstrap_popover.asp)
*/
const Wrapper = ({children}) => (children);

Wrapper.propTypes = {
  children: PropTypes.element,
};

export default class PopoverContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { visible: props.startOpen };

    this.set = this.set.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);

    // We need to set up and instantiate an onClickOutside wrapper
    // It's important to instantiate it once and pass though its children,
    // otherwise the diff algorithm won't be able to figure out our hijinks.
    // https://github.com/Pomax/react-onclickoutside

    // We do extra work with disableOnClickOutside and handleClickOutside
    // to prevent event bindings from being created until the popover is opened.
    const handleClickOutside = this.handleClickOutside.bind(this);
    const clickOutsideConfig = {
      handleClickOutside: () => handleClickOutside,
      excludeScrollbar: true,
    };
    this.MonitoredComponent = onClickOutside(Wrapper, clickOutsideConfig);
  }

  handleClickOutside(event) {
    // On keyup events, only hide the popup if it was the Escape key
    if(event.type === "keyup" && !["Escape", "Esc"].includes(event.key)) {
      return;
    }

    this.setState({visible: false});
  }

  set(visible) {
    this.setState({visible});
  }

  toggle() {
    this.setState((prevState) => {
      return {visible: !prevState.visible};
    });
  }

  // show() {
  //   this.setState(() => {
  //     return {visible: true};
  //   });
  // }


  render() {
    const props = {
      visible: this.state.visible,
      togglePopover: this.toggle,
      setVisible: this.set,
    };
    const inner = this.props.children(props);
    if(isFragment(inner)) {
      console.error("PopoverContainer does not support  as the top level item. Please use a different element.");
    }
    const outer = this.props.outer ? this.props.outer(props) : null;
    return (
      <>
        {outer}
        <this.MonitoredComponent disableOnClickOutside={!this.state.visible} eventTypes={["mousedown", "touchstart", "keyup"]}>
          {inner}
        </this.MonitoredComponent>
      </>
    );
  }
}

PopoverContainer.propTypes = {
  children: PropTypes.func.isRequired,
  outer: PropTypes.func,
  startOpen: PropTypes.bool,
};
PopoverContainer.defaultProps = {
  startOpen: false,
};