import React from 'react';
import PropTypes from 'prop-types';

import Layout from '../layout.jsx';

import {getEditorUrl} from '../../models/project';
import {AnalyticsContext} from '../analytics';
import {CurrentUserConsumer} from '../current-user.jsx';
import Link from '../includes/link.jsx';

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

const Callout = ({classes, imgUrl, title, description}) => (
  <div className={"callout " + classes}>
    <img className="badge" src={imgUrl} alt={title}></img>  
    <div className="window">
      <div className="title">{title}</div>
      <div className="description">{description}</div>
    </div>
  </div>
);
Callout.propTypes = {
  classes: PropTypes.string,
  imgUrl: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
};
  
class WhatIsGlitch extends React.Component {
  componentDidMount() {
    loadScript('//fast.wistia.com/embed/medias/i0m98yntdb.jsonp');
    loadScript('//fast.wistia.com/assets/external/E-v1.js');
  }
  
  render() {
    const witchLarge = "https://cdn.glitch.com/a67e7e84-c063-4c8e-a7fc-f4c7ab86186f%2Fglitch-witch-large.svg?1543872118446";
    const witchSmall = "https://cdn.glitch.com/a67e7e84-c063-4c8e-a7fc-f4c7ab86186f%2Fglitch-witch-small.svg?1543872119039";
    
    const discover = "https://cdn.glitch.com/a67e7e84-c063-4c8e-a7fc-f4c7ab86186f%2Fexplore-illustration.svg?1543508598659";
    const remix = "https://cdn.glitch.com/a67e7e84-c063-4c8e-a7fc-f4c7ab86186f%2Fremix-illustration.svg?1543508529783";
    const collaborate = "https://cdn.glitch.com/a67e7e84-c063-4c8e-a7fc-f4c7ab86186f%2Fcollaborate-illustration.svg?1543508686482";
    
    const play = "https://cdn.glitch.com/6ce807b5-7214-49d7-aadd-f11803bc35fd%2Fplay.svg";
    const whatsGlitchAlt = "Glitch is the friendly community where you'll find the app of your dreams";
    
    return (
      <section className="what-is-glitch">
        <span>
          <figure>
            <img className="witch large" src={witchLarge} alt={whatsGlitchAlt}/>
            <img className="witch small" src={witchSmall} alt={whatsGlitchAlt}/>
            
            <OverlayVideo>
              <div className="button video">
                <img className="play-button" src={play} alt="How it works"/>
                <span>How it works</span>
              </div>
            </OverlayVideo>
          </figure>
          
          <div className="callouts">
            <Callout classes="discover" imgUrl={discover} title="Explore Apps" description="Discover over a million free apps built by people like you"/>
            <Callout classes="remix" imgUrl={remix} title="Remix Anything" description="Edit any project and have your own app running instantly"/>
            <Callout classes="collaborate" imgUrl={collaborate} title="Build with Your Team" description="Invite everyone to create together"/>          </div>
              
        </span>
      </section>
    );
  }
}

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
    {!user.login && <WhatIsGlitch/>}
    
    {!!user.projects.length && <RecentProjects api={api}/>}
    {!!user.login && <Questions api={api}/>}
    <Featured isAuthorized={!!user.login}/>
    <RandomCategories api={api}/>
    <Categories/>
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
    <AnalyticsContext properties={{origin: 'index'}}>
      <CurrentUserConsumer>
        {user => <IndexPage api={api} user={user}/>}
      </CurrentUserConsumer>
    </AnalyticsContext>
  </Layout>
);

export default IndexPageContainer;
