import React from 'react';
import PropTypes from 'prop-types';

import { Link as RouterLink } from 'react-router-dom';

import { getLink as getCollectionLink } from '../../models/collection';
import { getLink as getProjectLink } from '../../models/project';
import { getLink as getTeamLink } from '../../models/team';
import { getLink as getUserLink } from '../../models/user';

/* global EXTERNAL_ROUTES */
const external = Array.from(EXTERNAL_ROUTES);

export const Link = ({to, children, ...props}) => {
  if (typeof to === 'string') {
    const currentUrl = new URL(window.location.href);
    const targetUrl = new URL(to, currentUrl);

    if (targetUrl.origin !== currentUrl.origin ||
      external.some(route => targetUrl.pathname.startsWith(route))
    ) {
      return <a href={to} {...props}>{children}</a>;
    }
    
    to = {
      pathname: targetUrl.pathname,
      search: targetUrl.search,
      hash: targetUrl.hash,
    };
  }
  
  return <RouterLink to={to} {...props}>{children}</RouterLink>;
};
Link.propTypes = {
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  children: PropTypes.node.isRequired,
};

export const CollectionLink = ({collection, children, ...props}) => (
  <Link to={getCollectionLink(collection)} {...props}>{children}</Link>
);
CollectionLink.propTypes = {
  collection: PropTypes.oneOfType([
    PropTypes.shape({
      team: PropTypes.PropTypes.shape({
        url: PropTypes.string.isRequired,
      }).isRequired,
      url: PropTypes.string.isRequired,
    }),
    PropTypes.shape({
      user: PropTypes.PropTypes.shape({
        id: PropTypes.number.isRequired,
        login: PropTypes.string,
      }).isRequired,
      url: PropTypes.string.isRequired,
    }),
  ]).isRequired,
};

export const ProjectLink = ({project, children, ...props}) => (
  <Link to={getProjectLink(project.domain)} {...props}>{children}</Link>
);
ProjectLink.propTypes = {
  project: PropTypes.shape({
    domain: PropTypes.string.isRequired,
  }).isRequired,
};

export const TeamLink = ({team, children, ...props}) => (
  <Link to={getTeamLink(team)} {...props}>{children}</Link>
);
TeamLink.propTypes = {
  team: PropTypes.shape({
    url: PropTypes.string.isRequired,
  }).isRequired,
};

export const UserLink = ({user, children, ...props}) => (
  <Link to={getUserLink(user)} {...props}>{children}</Link>
);
UserLink.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    login: PropTypes.string,
  }).isRequired,
};

export default Link;