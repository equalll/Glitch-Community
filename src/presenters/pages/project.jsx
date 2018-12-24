/* global analytics APP_URL */

import React from 'react';
import PropTypes from 'prop-types';

import Helmet from 'react-helmet';
import {getAvatarUrl} from '../../models/project';

import {AnalyticsContext} from '../analytics';
import {DataLoader} from '../includes/loader.jsx';
import NotFound from '../includes/not-found.jsx';
import {Markdown} from '../includes/markdown.jsx';
import ProjectEditor from '../project-editor.jsx';
import Expander from '../includes/expander.jsx';
import EditableField from '../includes/editable-field.jsx';
import {AuthDescription} from '../includes/description-field.jsx';
import {InfoContainer, ProjectInfoContainer} from '../includes/profile.jsx';
import {ShowButton, EditButton, RemixButton} from '../includes/project-actions.jsx';
import ReportButton from '../pop-overs/report-abuse-pop.jsx';
import AddProjectToCollection from '../includes/add-project-to-collection.jsx';
import TeamsList from '../teams-list.jsx';
import UsersList from '../users-list.jsx';
import RelatedProjects from '../includes/related-projects.jsx';

import {CurrentUserConsumer} from '../current-user.jsx';

import Layout from '../layout.jsx';

function trackRemix(id, domain) {
  analytics.track("Click Remix", {
    origin: "project page",
    baseProjectId: id,
    baseDomain: domain,
  });
}

function syncPageToDomain(domain) {
  history.replaceState(null, null, `/~${domain}`);
}

const PrivateTooltip = "Only members can view code";
const PublicTooltip = "Visible to everyone";

const PrivateBadge = () => (
  <span className="project-badge private-project-badge" aria-label={PrivateTooltip} data-tooltip={PrivateTooltip}></span>
);

const PrivateToggle = ({isPrivate, setPrivate}) => {
  const tooltip = isPrivate ? PrivateTooltip : PublicTooltip;
  const classBase = "button-tertiary button-on-secondary-background project-badge";
  const className = isPrivate ? 'private-project-badge' : 'public-project-badge';
  return (
    <span data-tooltip={tooltip}>
      <button aria-label={tooltip}
        onClick={() => setPrivate(!isPrivate)}
        className={`${classBase} ${className}`}
      />
    </span>
  );
};
PrivateToggle.propTypes = {
  isPrivate: PropTypes.bool.isRequired,
  setPrivate: PropTypes.func.isRequired,
};

const Embed = ({domain}) => (
  <div className="glitch-embed-wrap">
    <iframe title="embed"
      src={`${APP_URL}/embed/#!/embed/${domain}?path=README.md&previewSize=100`}
      allow="geolocation; microphone; camera; midi; encrypted-media"
    ></iframe>
  </div>
);
Embed.propTypes = {
  domain: PropTypes.string.isRequired,
};

const ReadmeError = (error) => (
  (error && error.response && error.response.status === 404)
    ? <>This project would be even better with a <code>README.md</code></>
    : <>We couldn't load the readme. Try refreshing?</>
);
const ReadmeLoader = ({api, domain}) => (
  <DataLoader get={() => api.get(`projects/${domain}/readme`)} renderError={ReadmeError}>
    {({data}) => <Expander height={250}><Markdown>{data}</Markdown></Expander>}
  </DataLoader>
);
ReadmeLoader.propTypes = {
  api: PropTypes.any.isRequired,
  domain: PropTypes.string.isRequired,
};

const ProjectPage = ({
  project: {
    description, domain, users, teams,
    ...project // 'private' can't be used as a variable name
  },
  addProjectToCollection,
  api,
  currentUser,
  isAuthorized,
  updateDomain,
  updateDescription,
  updatePrivate,
}) => (
  <main className="project-page">
    <section id="info">
      <InfoContainer>
        <ProjectInfoContainer style={{backgroundImage: `url('${getAvatarUrl(project.id)}')`}}>
          <h1>
            {(isAuthorized ? (
              <EditableField value={domain} placeholder="Name your project"
                update={domain => updateDomain(domain).then(() => syncPageToDomain(domain))}
                suffix={<PrivateToggle isPrivate={project.private} isMember={isAuthorized} setPrivate={updatePrivate}/>}
              />
            ) : <>{domain} {project.private && <PrivateBadge/>}</>)}
          </h1>
          <div className="users-information">
            <UsersList users={users} />
            {!!teams.length && <TeamsList teams={teams}/>}
          </div>
          <AuthDescription
            authorized={isAuthorized} description={description}
            update={updateDescription} placeholder="Tell us about your app"
          />
          <p className="buttons">
            <ShowButton name={domain}/>
            <EditButton name={domain} isMember={isAuthorized}/>
          </p>
        </ProjectInfoContainer>
      </InfoContainer>
    </section>
    <section id="embed">
      <Embed domain={domain}/>
      <div className="buttons space-between">
        <ReportButton projectName={domain} projectId={project.id} />
        <div>
          {currentUser.login && <AddProjectToCollection className="button-small" api={api} currentUser={currentUser} project={project} fromProject={true} addProjectToCollection={addProjectToCollection}/>}
          <RemixButton className="button-small"
            name={domain} isMember={isAuthorized}
            onClick={() => trackRemix(project.id, domain)}
          />
        </div>
      </div>
    </section>
    <section id="readme">
      <ReadmeLoader api={api} domain={domain}/>
    </section>
    <section id="related">
      <RelatedProjects ignoreProjectId={project.id} {...{api, teams, users}}/>
    </section>
  </main>
);
ProjectPage.propTypes = {
  api: PropTypes.any.isRequired,
  currentUser: PropTypes.object.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
  project: PropTypes.object.isRequired,
};

async function getProject(api, domain) {
  const {data} = await api.get(`projects/${domain}`);
  console.log("project", data);
  return data;
}

const ProjectPageLoader = ({domain, api, currentUser, ...props}) => (
  <DataLoader get={() => getProject(api, domain)} renderError={() => <NotFound name={domain}/>}>
    {project => project ? (
      <ProjectEditor api={api} initialProject={project}>
        {(project, funcs, userIsMember) => (
          <>
            <Helmet>
              <title>{project.domain}</title>
            </Helmet>
            <ProjectPage api={api} project={project} {...funcs} isAuthorized={userIsMember} currentUser={currentUser} {...props}/>
          </>
        )}
      </ProjectEditor>
    ) : <NotFound name={domain}/>}
  </DataLoader>
);
ProjectPageLoader.propTypes = {
  api: PropTypes.func.isRequired,
  domain: PropTypes.string.isRequired,
  currentUser: PropTypes.object.isRequired,
};

const ProjectPageContainer = ({api, name}) => (
  <Layout api={api}>
    <AnalyticsContext properties={{origin: 'project'}}>
      <CurrentUserConsumer>
        {currentUser => <ProjectPageLoader api={api} domain={name} currentUser={currentUser}/>}
      </CurrentUserConsumer>
    </AnalyticsContext>
  </Layout>
);

export default ProjectPageContainer;