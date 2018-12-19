import PropTypes from 'prop-types';
import React from 'react';

import {UserLink} from './includes/link.jsx';
import {TruncatedMarkdown} from './includes/markdown.jsx';
import Thanks from './includes/thanks.jsx';

import {ANON_AVATAR_URL, getAvatarUrl, getProfileStyle} from '../models/user.js';

function addDefaultSrc(event) {
  event.target.src = ANON_AVATAR_URL;
}

export default function UserItem({user}) {
  const style = getProfileStyle({...user, size: 'medium'});
  return (
    <UserLink user={user} className="button-area">
      <div className="item" style={style}>
        <div className="content">
          <img onError={addDefaultSrc} className="avatar" src={getAvatarUrl(user)} alt=""></img>
          <div className="information">
            {!!user.name && <h3 className="name">{user.name}</h3>}
            <div className="button">@{user.login}</div>
            {user.thanksCount > 0 && <Thanks count={user.thanksCount} />}
            {!!user.description && <p className="description"><TruncatedMarkdown length={96}>{user.description}</TruncatedMarkdown></p>}
          </div>
        </div>
      </div>
    </UserLink>
  );
}

UserItem.propTypes = {
  user: PropTypes.shape({
    avatarUrl: PropTypes.string,
    coverColor: PropTypes.string,
    description: PropTypes.string,
    hasCoverImage: PropTypes.bool.isRequired,
    id: PropTypes.number.isRequired,
    login: PropTypes.string.isRequired,
    name: PropTypes.string,
    thanksCount: PropTypes.number.isRequired,
  }),
};