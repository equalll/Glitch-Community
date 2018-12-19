import React from 'react';
import PropTypes from 'prop-types';

import Helmet from 'react-helmet';
import DevToggles from '../includes/dev-toggles';
import {CurrentUserConsumer} from '../current-user';
import {DataLoader} from '../includes/loader';
import TeamEditor from '../team-editor.jsx';
import {getLink, getAvatarStyle, getProfileStyle} from '../../models/team';
import {AuthDescription} from '../includes/description-field.jsx';
import {ProfileContainer, ImageButtons} from '../includes/profile.jsx';
import ErrorBoundary from '../includes/error-boundary';

//import SampleTeamCollections from '../../curated/sample-team-collections.jsx';
import CollectionsList from '../collections-list';

import EditableField from '../includes/editable-field.jsx';
import Thanks from '../includes/thanks.jsx';
import NameConflictWarning from '../includes/name-conflict.jsx';
import AddTeamProject from '../includes/add-team-project.jsx';
import DeleteTeam from '../includes/delete-team.jsx';
import {AddTeamUser, TeamUsers, WhitelistedDomain, JoinTeam} from '../includes/team-users.jsx';
import EntityPagePinnedProjects from '../entity-page-pinned-projects.jsx';
import EntityPageRecentProjects from '../entity-page-recent-projects.jsx';
import ProjectsLoader from '../projects-loader.jsx';
import TeamAnalytics from '../includes/team-analytics.jsx';
import {TeamMarketing, VerifiedBadge} from '../includes/team-elements.jsx';

function syncPageToUrl(team) {
  history.replaceState(null, null, getLink(team));
}

const TeamNameUrlFields = ({team, updateName, updateUrl}) => (
  <>
    <h1>
      <EditableField
        value={team.name}
        update={updateName}
        placeholder="What's its name?"
        suffix={team.isVerified ? <VerifiedBadge/> : null}
      />
    </h1>
    <p className="team-url">
      <EditableField
        value={team.url}
        update={url => updateUrl(url).then(() => syncPageToUrl({...team, url}))}
        placeholder="Short url?"
        prefix="@"
      />
    </p>
  </>
);

const TeamPageCollections = ({collections, team, api, currentUser, currentUserIsOnTeam}) => (
  <DevToggles>
    {enabledToggles => (
      <CollectionsList
        title={<>Collections {!collections.length && currentUserIsOnTeam && (
          <aside className="inline-banners team-page">
            Use collections to organize projects
          </aside>
        )}</>}
        collections={collections.map(collection => ({...collection, team: team}))}
        api={api} maybeCurrentUser={currentUser} maybeTeam={team}
        isAuthorized={currentUserIsOnTeam && enabledToggles.includes('Team Collections')}
      />
    )}
  </DevToggles>
);

// Team Page

class TeamPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.teamAdmins = this.teamAdmins.bind(this);
    this.addProjectToCollection = this.addProjectToCollection.bind(this);
  }
  
  async addProjectToCollection(project, collection) {
    await this.props.api.patch(`collections/${collection.id}/add/${project.id}`);
  }

  teamAdmins() {
    return this.props.team.users.filter(user => {
      return this.props.team.adminIds.includes(user.id);
    });
  }
  
  userCanJoinTeam() {
    const {currentUser, team} = this.props;
    if (!this.props.currentUserIsOnTeam && team.whitelistedDomain && currentUser && currentUser.emails) {
      return currentUser.emails.some(({email, verified}) => verified && email.endsWith(`@${team.whitelistedDomain}`));
    }
    return false;
  }

  render() {
    return (
      <main className="profile-page team-page">
        <section>
          <a href="/teams/" target="_blank" className="beta">
            <img src="https://cdn.glitch.com/0c3ba0da-dac8-4904-bb5e-e1c7acc378a2%2Fbeta-flag.svg?1541448893958" alt=""></img>
            <div>
              <h4>Teams are in beta</h4>
              <p>Learn More</p>
            </div>
          </a>
          <ProfileContainer
            avatarStyle={getAvatarStyle({...this.props.team, cache: this.props.team._cacheAvatar})}
            coverStyle={getProfileStyle({...this.props.team, cache: this.props.team._cacheCover})}
            avatarButtons={this.props.currentUserIsTeamAdmin ? 
              <ImageButtons name="Avatar" uploadImage={this.props.uploadAvatar} /> 
              : null
            }
            coverButtons={this.props.currentUserIsTeamAdmin ? 
              <ImageButtons name="Cover"
                uploadImage={this.props.uploadCover}
                clearImage={this.props.team.hasCoverImage ? 
                  this.props.clearCover : null
                }
              /> : null
            }>
            {this.props.currentUserIsTeamAdmin ? (
              <TeamNameUrlFields team={this.props.team} updateName={this.props.updateName} updateUrl={this.props.updateUrl}/>
            ) : (
              <>
                <h1>{this.props.team.name} {this.props.team.isVerified && <VerifiedBadge/>}</h1>
                <p className="team-url">@{this.props.team.url}</p>
              </>
            )}
            <div className="users-information">
              <TeamUsers 
                {...this.props}
                users={this.props.team.users}
                teamId={this.props.team.id}
                adminIds={this.props.team.adminIds}
              />
              { !!this.props.team.whitelistedDomain &&
                <WhitelistedDomain domain={this.props.team.whitelistedDomain}
                  setDomain={this.props.currentUserIsTeamAdmin ? this.props.updateWhitelistedDomain : null}
                />
              }
              { this.props.currentUserIsOnTeam &&
                <AddTeamUser
                  inviteEmail={this.props.inviteEmail}
                  inviteUser={this.props.inviteUser}
                  setWhitelistedDomain={this.props.currentUserIsTeamAdmin ? this.props.updateWhitelistedDomain : null}
                  members={this.props.team.users.map(({id}) => id)}
                  whitelistedDomain={this.props.team.whitelistedDomain}
                  api={this.props.api}
                />
              }
              { this.userCanJoinTeam() && <JoinTeam onClick={this.props.joinTeam}/> }
            </div>
            <Thanks count={this.props.team.users.reduce((total, {thanksCount}) => total + thanksCount, 0)} />
            <AuthDescription
              authorized={this.props.currentUserIsTeamAdmin}
              description={this.props.team.description}
              update={this.props.updateDescription}
              placeholder="Tell us about your team"
            />
          </ProfileContainer>
        </section>

        <ErrorBoundary>
          <AddTeamProject
            {...this.props}
            teamProjects={this.props.team.projects}
            api={this.props.api}
          />
        </ErrorBoundary>
        
        <EntityPagePinnedProjects
          projects={this.props.team.projects}
          pins={this.props.team.teamPins}
          isAuthorized={this.props.currentUserIsOnTeam}
          removePin={this.props.removePin}
          projectOptions={{
            addProjectToCollection: this.addProjectToCollection,
            removeProjectFromTeam: this.props.removeProject,
            joinTeamProject: this.props.joinTeamProject,
            leaveTeamProject: this.props.leaveTeamProject,
          }}
          api={this.props.api}
        />
        
        <EntityPageRecentProjects
          projects={this.props.team.projects}
          pins={this.props.team.teamPins}
          isAuthorized={this.props.currentUserIsOnTeam}
          addPin={this.props.addPin}
          projectOptions={{
            addProjectToCollection: this.addProjectToCollection,
            removeProjectFromTeam: this.props.removeProject,
            joinTeamProject: this.props.joinTeamProject,
            leaveTeamProject: this.props.leaveTeamProject,
          }}
          api={this.props.api}
        />
        
        { (this.props.team.projects.length === 0 && this.props.currentUserIsOnTeam) &&
          <aside className="inline-banners add-project-to-empty-team-banner">
            <div className="description-container">
              <img className="project-pals" src="https://cdn.glitch.com/02ae6077-549b-429d-85bc-682e0e3ced5c%2Fcollaborate.svg?1540583258925" alt="" />
              <div className="description">Add projects to share them with your team</div>
            </div>
          </aside>
        }
        
        {/* TEAM COLLECTIONS */}
        <ErrorBoundary>
          <DataLoader
            get={() => this.props.api.get(`collections?teamId=${this.props.team.id}`)}
            renderLoader={() => <TeamPageCollections {...this.props} collections={this.props.team.collections}/>}
          >
            {({data}) => <TeamPageCollections {...this.props} collections={data}/>}
          </DataLoader>
        </ErrorBoundary>
        
        { this.props.currentUserIsOnTeam && <ErrorBoundary>
          <TeamAnalytics
            api={this.props.api}
            id={this.props.team.id}
            currentUserIsOnTeam={this.props.currentUserIsOnTeam}
            projects={this.props.team.projects}
            addProject={this.props.addProject}
            myProjects={this.props.currentUser ? this.props.currentUser.projects : []}
          />
        </ErrorBoundary>}

        {this.props.currentUserIsTeamAdmin && (
          <DeleteTeam api={() => this.props.api}
            teamId={this.props.team.id}
            teamName={this.props.team.name}
            teamAdmins={this.teamAdmins()}
            users={this.props.team.users}
          />
        )}

        { !this.props.currentUserIsOnTeam &&
          <TeamMarketing />
        }
      </main>
    );
  }
}

TeamPage.propTypes = {
  team: PropTypes.shape({
    _cacheAvatar: PropTypes.number.isRequired,
    _cacheCover: PropTypes.number.isRequired,
    adminIds: PropTypes.array.isRequired,
    backgroundColor: PropTypes.string.isRequired,
    coverColor: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    hasAvatarImage: PropTypes.bool.isRequired,
    hasCoverImage: PropTypes.bool.isRequired,
    id: PropTypes.number.isRequired,
    isVerified: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    projects: PropTypes.array.isRequired,
    teamPins: PropTypes.array.isRequired,
    users: PropTypes.array.isRequired,
    whitelistedDomain: PropTypes.string,
  }),
  addPin: PropTypes.func.isRequired,
  addProject: PropTypes.func.isRequired,
  updateWhitelistedDomain: PropTypes.func.isRequired,
  inviteEmail: PropTypes.func.isRequired,
  inviteUser: PropTypes.func.isRequired,
  api: PropTypes.func.isRequired,
  clearCover: PropTypes.func.isRequired,
  currentUser: PropTypes.object,
  currentUserIsOnTeam: PropTypes.bool.isRequired,
  currentUserIsTeamAdmin: PropTypes.bool.isRequired,
  removeUserFromTeam: PropTypes.func.isRequired,
  removePin: PropTypes.func.isRequired,
  removeProject: PropTypes.func.isRequired,
  updateName: PropTypes.func.isRequired,
  updateUrl: PropTypes.func.isRequired,
  updateDescription: PropTypes.func.isRequired,
  uploadAvatar: PropTypes.func.isRequired,
  uploadCover: PropTypes.func.isRequired,
};

const teamConflictsWithUser = (team, currentUser) => {
  if (currentUser && currentUser.login) {
    return currentUser.login.toLowerCase() === team.url;
  }
  return false;
};

const TeamNameConflict = ({team}) => (
  <CurrentUserConsumer>
    {currentUser => (
      teamConflictsWithUser(team, currentUser) && <NameConflictWarning/>
    )}
  </CurrentUserConsumer>
);

const TeamPageEditor = ({api, initialTeam, children}) => (
  <TeamEditor api={api} initialTeam={initialTeam}>
    {(team, funcs, ...args) => (
      <ProjectsLoader api={api} projects={team.projects}>
        {(projects, reloadProjects) => {
          // Inject page specific changes to the editor
          // Mainly url updating and calls to reloadProjects
          
          const removeUserFromTeam = async (user, projectIds) => {
            await funcs.removeUserFromTeam(user, projectIds);
            reloadProjects(...projectIds);
          };
          
          const joinTeamProject = async (projectId) => {
            await funcs.joinTeamProject(projectId);
            reloadProjects(projectId);
          };
          
          const leaveTeamProject = async (projectId) => {
            await funcs.leaveTeamProject(projectId);
            reloadProjects(projectId);
          };
          
          return children({...team, projects}, {
            ...funcs,
            removeUserFromTeam,
            joinTeamProject,
            leaveTeamProject,
          }, ...args);
        }}
      </ProjectsLoader>
    )}
  </TeamEditor>
);
const TeamPageContainer = ({api, team, ...props}) => (
  <TeamPageEditor api={api} initialTeam={team}>
    {(team, funcs, currentUserIsOnTeam, currentUserIsTeamAdmin) => (
      <>
        <Helmet>
          <title>{team.name}</title>
        </Helmet>
        <CurrentUserConsumer>
          {currentUser => (
            <TeamPage api={api} team={team} {...funcs} currentUser={currentUser}
              currentUserIsOnTeam={currentUserIsOnTeam} currentUserIsTeamAdmin={currentUserIsTeamAdmin}
              {...props}
            />
          )}
        </CurrentUserConsumer>
        <TeamNameConflict team={team}/>
      </>
    )}
  </TeamPageEditor>
);
export default TeamPageContainer;