import React from 'react';
import PropTypes from 'prop-types';

export const Loader = () => (
  <div className="loader">
    <div className="moon"></div>
    <div className="earth"></div>
    <div className="asteroid"></div>    
    <div className="asteroid-dust"></div>    
  </div>    
);
export default Loader;

export class DataLoader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      maybeData: null,
      loaded: false,
      maybeError: null,
    };
  }
  
  componentDidMount() {
    this.props.get().then(
      data => this.setState({
        maybeData: data,
        loaded: true,
      }),
      error => {
        console.error(error);
        this.setState({
          maybeError: error,
        });
      }
    );
  }
  
  render() {
    if (this.state.loaded) {
      return this.props.children(this.state.maybeData);
    } else if (this.state.maybeError) {
      return this.props.renderError(this.state.maybeError);
    } 
    return this.props.renderLoader();
    
  }
}
DataLoader.propTypes = {
  children: PropTypes.func.isRequired,
  get: PropTypes.func.isRequired,
  renderError: PropTypes.func,
  renderLoader: PropTypes.func,
};
DataLoader.defaultProps = {
  renderError: () => 'Something went wrong, try refreshing?',
  renderLoader: Loader,
};
