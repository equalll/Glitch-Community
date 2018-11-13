import React from 'react';
import PropTypes from 'prop-types';

import OverlayVideo from '../overlays/overlay-video.jsx';
import Link from '../includes/link.jsx';
import NewProjectPop from "../pop-overs/new-project-pop.jsx";

function loadScript(src) {
  const script = document.createElement('script');
  script.src = src;
  script.async = true;
  document.head.appendChild(script);
}

export default class HowItWorks extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    loadScript('//fast.wistia.com/embed/medias/i0m98yntdb.jsonp');
    loadScript('//fast.wistia.com/assets/external/E-v1.js');
  }
  
  render() {
    const free = "https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Ffree.svg?1499350845981";
    const play = "https://cdn.hyperdev.com/6ce807b5-7214-49d7-aadd-f11803bc35fd%2Fplay.svg";
    const illustration = "https://cdn.glitch.com/543c059e-33e3-4490-8582-b02ea65ed3a0%2Fwhat-is-glitch-simple.svg?1542137894293"
    // const whatsGlitchWide = "https://cdn.glitch.com/f7224274-1330-4022-a8f2-8ae09dbd68a8%2Fwhats-glitch-wide.svg?1499885209761";
    // const whatsGlitchNarrow = "https://cdn.glitch.com/f7224274-1330-4022-a8f2-8ae09dbd68a8%2Fwhats-glitch-narrow.svg?1499884900667";
    // const whatsGlitchAlt = "Create a node app, or remix one. It updates as you type. Code with Friends!";
    return (
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="explanation">
          <p>Discover over a million free apps, bots & games you can't find anywhere else,</p>
          <p>Remix anything you find and edit it to make it your own,</p>
          <p>Invite your whole team and build together.</p>
        </div>

        <figure title="How Glitch works">
          <img src={illustration} alt=""/>  
        </figure>
        
        <div className="inline-banners">
          <p>
            Glitch is <img className="free" src={free} alt="free"/>
          </p>
          <p>
            <OverlayVideo>
              <div className="video">
                <img className="play-button" src={play} alt="play"/>
                <span>How it works in 1 minute</span>
              </div>
            </OverlayVideo>
          </p>

          <p>
            <Link to="/about/features">
              Features
            </Link>
          </p>

          <p>
            <Link to="/teams">
              About Teams
            </Link>
          </p>
          <NewProjectPop api={api}/>
        </div>
      </section>
    );
  }
}

HowItWorks.propTypes = {
  api: PropTypes.func.isRequired,
};

