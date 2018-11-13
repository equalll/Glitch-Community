import React from 'react';
import PropTypes from 'prop-types';

import Layout from '../layout.jsx';

import {getEditorUrl} from '../../models/project';
import {CurrentUserConsumer} from '../current-user.jsx';
import Link from '../includes/link.jsx';

import Categories from '../categories.jsx';
import Featured from '../featured.jsx';
import Questions from '../questions.jsx';
import RandomCategories from '../random-categories.jsx';
import RecentProjects from '../recent-projects.jsx';
import HowItWorks from '../includes/how-it-works.jsx';

const MadeInGlitch = () => (
  <section className="made-in-glitch">
    <p>Of course, this site was made on Glitch too</p>
    <Link to={getEditorUrl('community')} className="button button-link has-emoji">
      View Source <span className="emoji carp_streamer"></span>
    </Link>
  </section>
);

const IndexPage = ({api, user}) => (
  <main>
    <h1 className="headline">
      <Link to="https://glitch.com">Glitch</Link>{' '}
      is the friendly community where everyone can discover & create the best stuff on the web
    </h1>
    {!!(user && user.login) && <Questions api={api}/>}
    {!!(user && user.projects.length) && <RecentProjects api={api}/>}
    <Featured/>
    <RandomCategories api={api}/>
    <Categories/>
    {!(user && user.login) && <HowItWorks api={api}/>}
    <MadeInGlitch/>
  </main>
);
IndexPage.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
    login: PropTypes.string,
  }),
};

const IndexPageContainer = ({api}) => (
  <Layout api={api}>
    <CurrentUserConsumer>
      {user => <IndexPage api={api} user={user}/>}
    </CurrentUserConsumer>
  </Layout>
);

export default IndexPageContainer;
