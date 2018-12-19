// this is shown when a team has no collections
import React from 'react';

import CollectionAvatar from '../presenters/includes/collection-avatar.jsx';
import {hexToRgbA} from '../models/collection.js';

const SampleCollections = () => (
  <>
    <ul className="collections-container">
      <li>
        <div className='collection'>
          <div className="collection-container">
            <div className="collection-info" style={{backgroundColor: "#EBEBEB"}}>
              <div className="avatar-container">
                <div className="avatar">
                  <CollectionAvatar backgroundColor={hexToRgbA("#EBEBEB")}/>
                </div>
              </div>
              <div className="collection-name-description">
                <div className="button">
                  <div className="project-name">Getting Started</div>
                </div>
                <div className="description">
                  Sample projects to help you get started with our API
                </div>
              </div>
            </div>
          </div>
          {/* TO DO: Add sample projects here */}
        </div>
      </li>
      
      <li>
        <div className='collection'>
          <div className="collection-container">
            <div className="collection-info" style={{backgroundColor: "#FFFDE6"}}>
              <div className="avatar-container">
                <div className="avatar">
                  <CollectionAvatar backgroundColor={hexToRgbA("#FFFDE6")}/>
                </div>
              </div>
              <div className="collection-name-description">
                <div className="button">
                  <div className="project-name">Hackathon 2018</div>
                </div>
                <div className="description">
                  Team projects from September Hackathon
                </div>
              </div>
            </div>
          </div>
          {/* TO DO: Add sample projects here */}
        </div>
      </li>
      
    </ul>
    <div className="placeholder-mask"></div>
  </>
);

export default SampleCollections;