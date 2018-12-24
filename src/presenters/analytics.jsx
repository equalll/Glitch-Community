/* global analytics */

import React from 'react';
import PropTypes from 'prop-types';

import {isFunction, omit} from 'lodash';
import {captureException} from '../utils/sentry';

const Context = React.createContext({properties: {}, context: {}});

const resolveProperties = (properties={}, inheritedProperties) => {
  if (isFunction(properties)) {
    return properties(inheritedProperties);
  }
  return {...inheritedProperties, ...properties};
};

// stick this in the tree to add a property value to any tracking calls within it
export const AnalyticsContext = ({children, properties, context}) => (
  <Context.Consumer>
    {inherited => (
      <Context.Provider value={{
        properties: resolveProperties(properties, inherited.properties),
        context: resolveProperties(context, inherited.context),
      }}>
        {children}
      </Context.Provider>
    )}
  </Context.Consumer>
);
AnalyticsContext.propTypes = {
  children: PropTypes.node.isRequired,
  properties: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.func,
  ]),
  context: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.func,
  ]),
};

// this gives you a generic track function that pulls in inherited properties
export const AnalyticsTracker = ({children}) => (
  <Context.Consumer>
    {inherited => children((name, properties, context) => {
      try {
        analytics.track(name, resolveProperties(properties, inherited.properties), resolveProperties(context, inherited.context));
      } catch (error) {
        captureException(error);
      }
    })}
  </Context.Consumer>
);
AnalyticsTracker.propTypes = {
  children: PropTypes.func.isRequired,
};

// this is the equivalent of doing <AnalyticsTracker>{track => <asdf onClick={() => track('asdf')}/></AnalyticsTracker>
// this won't work for links that do a full page load, because the request will get cancelled by the nav
// use the TrackedExternalLink for that, because it will stall the page for a moment and let the request finish
export const TrackClick = ({children, name, properties, context}) => (
  <AnalyticsTracker>
    {track => React.Children.map(children, child => {
      function onClick(...args) {
        track(name, properties, context);
        if (child.props.onClick) {
          return child.props.onClick(...args);
        }
      }
      return React.cloneElement(child, {onClick});
    })}
  </AnalyticsTracker>
);
TrackClick.propTypes = {
  children: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  properties: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.func,
  ]),
  context: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.func,
  ]),
};

// this pulls in segment's trackLink, which stalls the page load until the analytics request is done
// it forces a full page load at the end, so don't use it for links within the community site
class TrackedExternalLinkWithoutContext extends React.Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }
  componentDidMount() {
    try {
      analytics.trackLink(this.ref.current, () => this.props.name, () => this.props.properties);
    } catch (error) {
      captureException(error);
    }
  }
  render() {
    const {children, to, ...props} = this.props;
    return <a href={to} {...omit(props, ['name', 'properties'])} ref={this.ref}>{children}</a>;
  }
}
export const TrackedExternalLink = ({children, name, properties, to, ...props}) => (
  <Context.Consumer>
    {inherited => (
      <TrackedExternalLinkWithoutContext to={to} name={name} properties={resolveProperties(properties, inherited.properties)} {...props}>
        {children}
      </TrackedExternalLinkWithoutContext>
    )}
  </Context.Consumer>
);
TrackedExternalLink.propTypes = {
  children: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  properties: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.func,
  ]),
  to: PropTypes.string.isRequired,
};