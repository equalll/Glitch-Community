import React from 'react';
import PropTypes from 'prop-types';

// This is a shim component that helps us allow observables to be
// monitored from inside react, rather than at the jade level.

export default class Observed extends React.Component {
  constructor(props) {
    super(props);
    this.state = { observedProps: null };
  }
  
  componentDidMount() {
    this.props.propsObservable.observe((props) => {
      this.setState({observedProps: props});
    });
    this.setState({observedProps: this.props.propsObservable()});
  }
  componentWillUnmount() {
    this.props.propsObservable.releaseDependencies();
  }
  
  render() {
    return this.state.observedProps ? <this.props.component {...this.state.observedProps}/> : null;
  }
}

Observed.propTypes = {
  propsObservable: PropTypes.func.isRequired,
  component: PropTypes.func.isRequired,
};