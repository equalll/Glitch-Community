import React from 'react';
import PropTypes from 'prop-types';
import onClickOutside from 'react-onclickoutside';

/*
A popover is a light, hollow roll made from an egg batter similar to
that of Yorkshire pudding, typically baked in muffin tins or dedicated
popover pans, which have straight-walled sides rather than angled.

...also it's a [Bootstrap UI pattern](https://www.w3schools.com/bootstrap/bootstrap_popover.asp)
*/

const PopoverContext = React.createContext();

export const PopoverContextConsumer = PopoverContext.Consumer;

const Wrapper = ({children}) => (
  <span>
    {children}
  </span>
);

export default class PopoverContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { visible: false };

    this.toggle = this.toggle.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    
    const clickOutsideConfig = {
      handleClickOutside: () => this.handleClickOutside,
      excludeScrollbar: true,
    };
    this.MonitoredComponent = onClickOutside(Wrapper, clickOutsideConfig);
  }
  
  handleClickOutside(event) {
    // On keyup events, only hide the popup if it was the 'esc' key (27).
    if(event.type === "keyup" && event.keyCode !== 27) {
      return;
    }
    
    this.setState({visible: false});
  }
  
  toggle() {
    this.setState((prevState) => {
      return {visible: !prevState.visible};
    });
  }

  render() {
    // Invoke the children as a react component, passing them the toggle visibility controls.
    // The <span> is needed because onClickOutside doesn't support React.Fragment
    //const Children = <this.props.children togglePopover={this.toggle} visible={this.state.visible}/>
    
    // The rest of this logic sets up and configures the onClickOutside wrapper
    // https://github.com/Pomax/react-onclickoutside

    // We do extra work with disableOnClickOutside and handleClickOutside
    // to prevent event bindings from being created until the popover is opened.
    
    
    return (
      <this.MonitoredComponent disableOnClickOutside={!this.state.visible}  eventTypes={["mousedown", "touchstart", "keyup"]}>
        <PopoverContext.Provider value={{visible: this.state.visible, togglePopover: this.toggle}}>
          {this.props.children}
        </PopoverContext.Provider>
      </this.MonitoredComponent>
    );
  }
}

PopoverContainer.propTypes = {
  children: PropTypes.func.isRequired,
};

