// deleted projects is a little strange
// it loads the projects from the api, but expects them to be stored elsewhere
// so it takes an initially empty list of projects and a function to fill it once they load

import React from 'react';
import PropTypes from 'prop-types';

import {getAvatarUrl} from '../models/project';

import {TrackClick} from './analytics';
import Loader from './includes/loader';

/* globals Set */

function clickUndelete(event, callback) {
  const node = event.target.closest('li');
  node.addEventListener('animationend', callback, {once: true});
  node.classList.add('slide-up');
}

const DeletedProject = ({id, domain, onClick}) => (
  <TrackClick name="Undelete clicked">
    <button className="button-unstyled" onClick={evt => clickUndelete(evt, onClick)}>
      <div className="deleted-project">
        <img className="avatar" src={getAvatarUrl(id)} alt=""/>
        <div className="deleted-project-name">{domain}</div>
        <div className="button button-small">Undelete</div>
      </div>
    </button>
  </TrackClick>
);
DeletedProject.propTypes = {
  id: PropTypes.string.isRequired,
  domain: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

const DeletedProjectsList = ({deletedProjects, undelete}) => (
  <ul className="deleted-projects-container">
    {deletedProjects.map(({id, domain}) => (
      <li key={id} className="deleted-project-container">
        <DeletedProject
          id={id} domain={domain}
          onClick={() => undelete(id)}
        />
      </li>
    ))}
  </ul>
);
DeletedProjectsList.propTypes = {
  deletedProjects: PropTypes.array.isRequired,
  undelete: PropTypes.func.isRequired,
};

export default class DeletedProjects extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shown: false,
      loaded: false,
    };
    this.clickShow = this.clickShow.bind(this);
    this.clickHide = this.clickHide.bind(this);
  }
  
  clickHide() {
    this.setState({
      shown: false,
      loaded: false,
    });
  }
  
  async clickShow() {
    this.setState({shown: true});
    try {
      const {data} = await this.props.api.get('user/deleted-projects');
      this.props.setDeletedProjects(data);
      this.setState({loaded: true});
    } catch (e) {
      this.setState({shown: false});
    }
  }
  
  renderContents() {
    if (!this.state.shown) {
      return <button className="button button-tertiary" onClick={this.clickShow}>Show</button>;
    } else if (!this.state.loaded) {
      return <Loader/>;
    } else if (!this.props.deletedProjects.length) {
      return 'nothing found';
    }
    return (
      <>
        <DeletedProjectsList {...this.props}/>
        <button className="button button-tertiary" onClick={this.clickHide}>Hide Deleted Projects</button>
      </>
    );
  }
  
  render() {
    return (
      <article className="deleted-projects">
        <h2>Deleted Projects <span className="emoji bomb emoji-in-title"></span></h2>
        {this.renderContents()}
      </article>
    );
  }
}
DeletedProjects.propTypes = {
  api: PropTypes.any.isRequired,
  deletedProjects: PropTypes.array.isRequired,
  setDeletedProjects: PropTypes.func.isRequired,
};