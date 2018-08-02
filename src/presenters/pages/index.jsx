import React from 'react';
import PropTypes from 'prop-types';

import moment from 'moment-mini';

import Layout from '../layout.jsx';

import {getEditorUrl} from '../../models/project';
import {CurrentUserConsumer} from '../current-user.jsx';

import Categories from '../categories.jsx';
import Featured from '../featured.jsx';
import OverlayVideo from '../overlays/overlay-video.jsx';
import Questions from '../questions.jsx';
import RandomCategories from '../random-categories.jsx';
import RecentProjects from '../recent-projects.jsx';



function loadScript(src) {
  const script = document.createElement('script');
  script.src = src;
  script.async = true;
  document.head.appendChild(script);
}
  
class WhatIsGlitch extends React.Component {
  componentDidMount() {
    loadScript('//fast.wistia.com/embed/medias/vskja9agqj.jsonp');
    loadScript('//fast.wistia.com/assets/external/E-v1.js');
  }
  
  render() {
    const free = "https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Ffree.svg?1499350845981";
    const play = "https://cdn.hyperdev.com/6ce807b5-7214-49d7-aadd-f11803bc35fd%2Fplay.svg";
    const whatsGlitchWide = "https://cdn.glitch.com/f7224274-1330-4022-a8f2-8ae09dbd68a8%2Fwhats-glitch-wide.svg?1499885209761";
    const whatsGlitchNarrow = "https://cdn.glitch.com/f7224274-1330-4022-a8f2-8ae09dbd68a8%2Fwhats-glitch-narrow.svg?1499884900667";
    const whatsGlitchAlt = "Create a node app, or remix one. It updates as you type. Code with Friends!";
    return (
      <section className="what-is-glitch">
        <h2>How It Works</h2>
        <span>
          <a href="https://glitch.com/about">
            <figure title="How Glitch works">
              <img className="wide" src={whatsGlitchWide} alt={whatsGlitchAlt}/>
              <img className="narrow" src={whatsGlitchNarrow} alt={whatsGlitchAlt}/>
            </figure>
          </a>
          <div>
            And it's <img className="free" src={free} alt="free"/>.{' '}
            <OverlayVideo>
              <div className="button video">
                <img className="play-button" src={play} alt="play"/>
                <span>How it works in 1 minute</span>
              </div>
            </OverlayVideo>
          </div>
        </span>
      </section>
    );
  }
}

class ByFogCreek extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {age: this.age()};
  }
  
  age() {
    const FOUNDED = '2000-08-14';
    return moment().diff(FOUNDED, 'years');
  }
  
  componentDidMount() {
    this.timer = window.setInterval(() => {
      this.setState({age: this.age()});
    }, moment.duration(5, 'minutes').asMilliseconds());
  }
  
  componentWillUnmount() {
    window.clearInterval(this.timer);
  }
  
  render() {
    const logo = "https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Ffogcreek.svg";
    return (
      <section className="by-fogcreek" role="complementary">
        <h2>Made By Fog Creek</h2>
        <img src={logo} alt="Fog Creek logo"/>
        <p>
          You might know us for making Trello, FogBugz, and co-creating Stack Overflow. 
          We're <a href="https://www.fogcreek.com">a friendly, self-funded company</a> that's
          been helping people make stuff for over {this.state.age} years.
        </p>
      </section>
    );
  }
}

const MadeInGlitch = () => (
  <section className="made-in-glitch">
    <p>Of course, this site was made on Glitch too</p>
    <a href={getEditorUrl('community')} className="button button-link has-emoji">
      View Source <span className="emoji carp_streamer"></span>
    </a>
  </section>
);

const IndexPage = ({api, categories, user}) => (
  <main>
    <h1 className="headline">
      <a href="https://glitch.com">Glitch</a>{' '}
      is the friendly community where you'll build the app of your dreams
    </h1>
    {!!(user && user.login) && <Questions api={api}/>}
    {!!user && <RecentProjects api={api}/>}
    <Featured/>
    <RandomCategories api={api}/>
    <Categories categories={categories}/>
    {!(user && user.login) && <WhatIsGlitch/>}
    <ByFogCreek/>
    <MadeInGlitch/>
  </main>
);
IndexPage.propTypes = {
  api: PropTypes.any.isRequired,
  user: PropTypes.shape({
    id: PropTypes.number,
    login: PropTypes.string,
  }),
};

const IndexPageContainer = ({application}) => (
  <Layout application={application}>
    <CurrentUserConsumer>
      {user => <IndexPage user={user} api={application.api()} categories={application.categories}/>}
    </CurrentUserConsumer>
  </Layout>
);

export default IndexPageContainer;
