import React from 'react';
import PropTypes from 'prop-types';

import {Helmet} from 'react-helmet';
import Layout from '../layout';

const telescopeImageUrl = 'https://cdn.glitch.com/7138972f-76e1-43f4-8ede-84c3cdd4b40a%2Ftelescope_404.svg?1543258683849';

export const NotFoundPage = ({api}) => (
  <Layout api={api}>
    <Helmet>
      <title>👻 Page not found</title> {/* eslint-disable-line */}
    </Helmet>
    <main className="error-page-container">
      <img className="error-image" src={telescopeImageUrl} alt="" width="318px" height="297px" />
      <div className="error-msg">
        <h1>Page Not Found</h1>
        <p>Maybe a typo, or perhaps it's moved?</p>
        <a className="button button-link" href="/">Back to Glitch</a>
      </div>
    </main>
  </Layout>
);

NotFoundPage.propTypes = {
  api: PropTypes.func.isRequired,
};

const emailImageUrl = 'https://cdn.glitch.com/26ac422d-705d-42be-b9cb-1fbdfe7e5a63%2Ferror-mailer.svg?1543429767321';

export const EmailErrorPage = ({api, title, description}) => (
  <Layout api={api}>
    <Helmet>
      <title>✉️ {title}</title> {/* eslint-disable-line */}
    </Helmet>
    <main className="error-page-container">
      <img className="error-image email-error-image" src={emailImageUrl} alt="" width="470px"/>
      <div className="error-msg">
        <h1>{title}</h1>
        <p>{description}</p>
        <a className="button button-link" href="/">Back to Glitch</a>
      </div>
    </main>
  </Layout>
);

EmailErrorPage.propTypes = {
  api: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

const oauthImageUrl = 'https://cdn.glitch.com/8ae9b195-ef39-406b-aee0-764888d15665%2Foauth-key.svg?1544466885907';

export const OauthErrorPage = ({api, title, description}) => (
  <Layout api={api}>
    <Helmet>
      <title>🔑 {title}</title> {/* eslint-disable-line */}
    </Helmet>
    <main className="error-page-container">
      <img className="error-image" src={oauthImageUrl} alt="" width="370px"/>
      <div className="error-msg">
        <h1>{title}</h1>
        <p>{description}</p>
        <a className="button button-link" href="/">Back to Glitch</a>
      </div>
    </main>
  </Layout>
);

OauthErrorPage.propTypes = {
  api: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};
