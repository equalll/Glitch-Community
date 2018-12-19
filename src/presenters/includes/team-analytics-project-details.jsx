import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

import {ProjectLink} from './link.jsx';
import Loader from './loader.jsx';
import {FALLBACK_AVATAR_URL, getAvatarUrl} from '../../models/project.js';

const RECENT_REMIXES_COUNT = 100;

const getProjectDetails = async ({id, api, currentProjectDomain}) => {
  let path = `analytics/${id}/project/${currentProjectDomain}/overview`;
  try {
    return await api.get(path);
  } catch (error) {
    console.error('getProjectDetails', error);
  }
};

const addFallbackSrc = (event) => {
  event.target.src = FALLBACK_AVATAR_URL;
};

const ProjectAvatar = ({project, className=''}) => (
  <img src={getAvatarUrl(project.id)} className={`avatar ${className}`}
    alt={project.domain} onError={addFallbackSrc}
  />
);
ProjectAvatar.propTypes = {
  project: PropTypes.shape({
    domain: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  }).isRequired,
  className: PropTypes.string,
};

const ProjectDetails = ({projectDetails}) => {
  // This uses dayjs().fromNow() a bunch of times
  // That requires the relativeTime plugin
  // Which is added to dayjs elsewhere
  return (
    <article className="project-details">
      <ProjectLink project={projectDetails}>
        <ProjectAvatar project={projectDetails}/>
      </ProjectLink>
      <table>
        <tbody>
          <tr>
            <td className="label">Created</td>
            <td>{dayjs(projectDetails.createdAt).fromNow()}</td>
          </tr>
          <tr>
            <td className="label">Last viewed</td>
            <td>{dayjs(projectDetails.lastAccess).fromNow()}</td>
          </tr>
          <tr>
            <td className="label">Last edited</td>
            <td>{dayjs(projectDetails.lastEditedAt).fromNow()}</td>
          </tr>
          <tr>
            <td className="label">Last remixed</td>
            <td>{projectDetails.lastRemixedAt ? dayjs(projectDetails.lastRemixedAt).fromNow() : "never"}</td>
          </tr>
          <tr>
            <td className="label">Total app views</td>
            <td>{projectDetails.numAppVisits}</td>
          </tr>
          <tr>
            <td className="label">Total code views</td>
            <td>{projectDetails.numEditorVisits}</td>
          </tr>
          <tr>
            <td className="label">Total direct remixes</td>
            <td>{projectDetails.numDirectRemixes}</td>
          </tr>
          <tr>
            <td className="label">Total remixes</td>
            <td>{projectDetails.numTotalRemixes}</td>
          </tr>
          { (projectDetails.baseProject.domain) &&
            <tr>
              <td className="label">Originally remixed from</td>
              <td>
                <ProjectLink project={projectDetails.baseProject}>
                  <ProjectAvatar project={projectDetails.baseProject} className="baseproject-avatar"/>
                  {projectDetails.baseProject.domain}
                </ProjectLink>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </article>
  );
};

const ProjectRemixItem = ({remix}) => {
  return (
    <ProjectLink project={remix}>
      <span data-tooltip={remix.domain} data-tooltip-left="true">
        <ProjectAvatar project={remix}/>
      </span>
    </ProjectLink>
  );
};

class TeamAnalyticsProjectDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isGettingData: true,
      projectDetails: {},
      projectRemixes: [],
    };
  }

  updateProjectDetails() {
    this.setState({
      isGettingData: true
    }); 
    getProjectDetails(this.props).then(({data}) => {
      this.setState({
        isGettingData: false,
        projectDetails: data,
        projectRemixes: data.remixes.slice(0, RECENT_REMIXES_COUNT),
      });
    });
  }
  
  componentDidMount() {
    this.updateProjectDetails();
  }
  
  componentDidUpdate(prevProps) {
    if (this.props.currentProjectDomain !== prevProps.currentProjectDomain) {
      this.updateProjectDetails();
    }
  }
    
  render() {
    if(this.state.isGettingData) {
      return <Loader/>;
    }
    
    return (
      <>
        <ProjectDetails 
          projectDetails = {this.state.projectDetails}
        />
        <article className="project-remixes">
          <h4>Latest Remixes</h4>
          { (this.state.projectRemixes.length === 0) &&
            <p>No remixes yet (／_^)／ ●</p>
          }
          { this.state.projectRemixes.map(remix => (
            <ProjectRemixItem
              key = {remix.id}
              remix = {remix}
            />
          ))}
        </article>
      </>
    );
  }
}

TeamAnalyticsProjectDetails.propTypes = {
  currentProjectDomain: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  api: PropTypes.any.isRequired,
};

export default TeamAnalyticsProjectDetails;
