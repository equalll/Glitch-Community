/* global analytics */

import React from 'react';
import PropTypes from 'prop-types';

import Project from '../../models/project';

import {DataLoader} from '../includes/loader.jsx';
import NotFound from '../includes/not-found.jsx';
import {Markdown} from '../includes/markdown.jsx';
import EntityEditor from '../entity-editor.jsx';
import Expander from '../includes/expander.jsx';
import EditableField from '../includes/editable-field.jsx';
import {AuthDescription} from '../includes/description-field.jsx';
import {InfoContainer, ProjectInfoContainer} from '../includes/profile.jsx';
import {ShowButton, EditButton, RemixButton, ReportButton} from '../includes/project-actions.jsx';
import UsersList from '../users-list.jsx';
import RelatedProjects from '../includes/related-projects.jsx';

import Layout from '../layout.jsx';

function trackRemix(id, domain) {
  analytics.track("Click Remix", {
    origin: "project page",
    baseProjectId: id,
    baseDomain: domain,
  });
}

const PrivateTooltip = "Only members can view code";
const PublicTooltip = "Visible to everyone";

const PrivateBadge = () => (
  <span className="private-project-badge" aria-label={PrivateTooltip} data-tooltip={PrivateTooltip}></span>
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
    <iframe title="embed" src={`https://glitch.com/embed/#!/embed/${domain}?path=README.md&previewSize=100`}></iframe>
  </div>
);
Embed.propTypes = {
  domain: PropTypes.string.isRequired,
};

const ReadmeError = (error) => (
  (error && error.response && error.response.status === 404)
    ? <React.Fragment>This project would be even better with a <code>README.md</code></React.Fragment>
    : <React.Fragment>We couldn't load the readme. Try refreshing?</React.Fragment>
);
const ReadmeLoader = ({api, domain}) => (
  <DataLoader get={() => api.get(`projects/${domain}/readme`)} renderError={ReadmeError}>
    {({data}) => <Expander height={200}><Markdown>{data}</Markdown></Expander>}
  </DataLoader>
);
ReadmeLoader.propTypes = {
  api: PropTypes.any.isRequired,
  domain: PropTypes.string.isRequired,
};

const ProjectPage = ({
  project: {
    avatar, description, domain, id,
    userIsCurrentUser, users, teams,
    ...project // 'private' can't be used as a variable name
  },
  api,
  isAuthorized,
  updateDomain,
  updateDescription,
  updatePrivate,
}) => (
  <main className="project-page">
    <section id="info">
      <InfoContainer>
        <ProjectInfoContainer style={{backgroundImage: `url('${avatar}')`}}>
          <h1>
            {(userIsCurrentUser
              ? <EditableField value={domain} update={updateDomain} placeholder="Name your project"/>
              : <React.Fragment>{domain} {project.private && <PrivateBadge/>}</React.Fragment>
            )}
          </h1>
          {(userIsCurrentUser &&
            <div>
              <PrivateToggle isPrivate={project.private} isMember={userIsCurrentUser} setPrivate={updatePrivate}/>
            </div>
          )}
          <UsersList users={users} />
          <AuthDescription
            authorized={userIsCurrentUser} description={description}
            update={updateDescription} placeholder="Tell us about your app"
          />
          <p className="buttons">
            <ShowButton name={domain}/>
            <EditButton name={domain} isMember={userIsCurrentUser}/>
          </p>
        </ProjectInfoContainer>
      </InfoContainer>
    </section>
    <section id="embed">
      <Embed domain={domain}/>
      <div className="buttons buttons-right">
        <RemixButton className="button-small"
          name={domain} isMember={userIsCurrentUser}
          onClick={() => trackRemix(id, domain)}
        />
      </div>
    </section>
    <section id="readme">
      <ReadmeLoader api={api} domain={domain}/>
    </section>
    <section id="related">
      <RelatedProjects ignoreProjectId={id} {...{api, teams, users}}/>
    </section>
    <section id="feedback" className="buttons buttons-right">
      <ReportButton name={domain} id={id} className="button-small button-tertiary"/>
    </section>
  </main>
);
ProjectPage.propTypes = {
  api: PropTypes.any.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
  project: PropTypes.object.isRequired,
};

const ProjectPageLoader = ({name, get, api, currentUserModel, ...props}) => (
  <DataLoader get={get} renderError={() => <NotFound name={name}/>}>
    {project => project ? (
      <ProjectEditor api={api} initialProject={project} currentUserModel={currentUserModel}>
        {(project, funcs, userIsMember) => (
          <ProjectPage api={api} project={project} {...funcs} isAuthorized={userIsMember} {...props}/>
        )}
      </ProjectEditor>
    ) : <NotFound name={name}/>}
  </DataLoader>
);
ProjectPageLoader.propTypes = {
  name: PropTypes.string.isRequired,
};

const getProps = (application, name) => ({
  api: application.api(),
  currentUserModel: application.currentUser(),
  get: () => application.api().get(`projects/${name}`).then(({data}) => (data ? Project(data).update(data).asProps() : null)),
  name,
});

const ProjectPageContainer = ({application, name}) => (
  <Layout application={application}>
    <ProjectPageLoader {...getProps(application, name)}/>
  </Layout>
);

export default ProjectPageContainer;
