import React from 'react';
// import PropTypes from 'prop-types';

import OverlayVideo from '../overlays/overlay-video.jsx';
import Link from '../includes/link.jsx';

function loadScript(src) {
  const script = document.createElement('script');
  script.src = src;
  script.async = true;
  document.head.appendChild(script);
}

export class HowItWorks extends React.Component {
  componentDidMount() {
    loadScript('//fast.wistia.com/embed/medias/i0m98yntdb.jsonp');
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
          <Link to="/about">
            <figure title="How Glitch works">
              <img className="wide" src={whatsGlitchWide} alt={whatsGlitchAlt}/>
              <img className="narrow" src={whatsGlitchNarrow} alt={whatsGlitchAlt}/>
            </figure>
          </Link>
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
