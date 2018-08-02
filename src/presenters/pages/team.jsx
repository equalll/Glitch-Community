/* global notify */

import React from 'react';
import PropTypes from 'prop-types';

import * as assets from '../../utils/assets';
import TeamModel, {getAvatarStyle, getProfileStyle} from '../../models/team';
import UserModel from '../../models/user';
import ProjectModel from '../../models/project';
import Reactlet from '../reactlet';
import LayoutPresenter from '../layout';
import TeamEditor from '../team-editor.jsx';

import {AuthDescription} from '../includes/description-field.jsx';
import {DataLoader} from '../includes/loader.jsx';
import {ProfileContainer, ImageButtons} from '../includes/profile.jsx';
import Thanks from '../includes/thanks.jsx';
import NotFound from '../includes/not-found.jsx';
import {Notifications} from '../notifications.jsx';
import Uploader from '../includes/uploader.jsx';

import AddTeamProject from '../includes/add-team-project.jsx';
import DeleteTeam from '../includes/delete-team.jsx';
import {AddTeamUser, TeamUsers} from '../includes/team-users.jsx';
import EntityEditor from '../entity-editor.jsx';
import EntityPageProjects from '../entity-page-projects.jsx';
import TeamAnalytics from '../includes/team-analytics.jsx';
import {TeamMarketing, VerifiedBadge} from '../includes/team-elements.jsx';
import TeamUpgradeInfoBanner from '../includes/team-upgrade-info-banner.jsx';
import TeamProjectLimitReachedBanner from '../includes/team-project-limit-reached-banner.jsx';
import UsersList from "../users-list.jsx";

const FREE_TEAM_PROJECTS_LIMIT = 5;
const ADD_PROJECT_PALS = "https://cdn.glitch.com/c53fd895-ee00-4295-b111-7e024967a033%2Fadd-projects-pals.svg?1533137032374"

// Team Page

class TeamPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.teamAdmins = this.teamAdmins.bind(this);
  }
 
  projectLimitIsReached() {
    if ((this.props.currentUserIsOnTeam && !this.props.teamHasUnlimitedProjects && this.props.team.projects.length) >= FREE_TEAM_PROJECTS_LIMIT) {
      return true
    } else {
      return false
    }
  }

  teamAdmins() {
    return this.props.team.users.filter(user => {
      return this.props.team.adminIds.includes(user.id);
    });
  }

  render() {
    return (
      <main className="profile-page team-page">
        <section>
          <ProfileContainer
            avatarStyle={getAvatarStyle({
              id: this.props.team.id, 
              hasAvatarImage: this.props.team.hasAvatarImage, 
              backgroundColor: this.props.team.backgroundColor, 
              cache: this.props.team._cacheAvatar,
            })}
            coverStyle={getProfileStyle({
              id: this.props.team.id, 
              hasCoverImage: this.props.team.hasCoverImage, 
              coverColor: this.props.team.coverColor, 
              cache: this.props.team._cacheCover,
            })}
            avatarButtons={this.props.currentUserIsTeamAdmin ? <ImageButtons name="Avatar" uploadImage={this.props.uploadAvatar} /> : null}
            coverButtons={this.props.currentUserIsTeamAdmin ? <ImageButtons name="Cover" 
              uploadImage={this.props.uploadCover}
              clearImage={this.props.team.hasCoverImage ? this.props.team.clearCover : null} /> : null
            }>
            <h1>
              { this.props.team.name }
              { this.props.team.isVerified && 
                <VerifiedBadge image={this.props.team.verifiedImage} tooltip={this.props.team.verifiedTooltip}/>
              }
            </h1>
            <div className="users-information">
              <TeamUsers {...this.props} 
                users={this.props.team.users}
                teamId={this.props.team.id}
                adminIds={this.props.team.adminIds}
              />
              { this.props.currentUserIsOnTeam && 
                <AddTeamUser 
                  search={this.props.searchUsers} 
                  add={this.props.addUser} 
                  members={this.props.team.users.map(({id}) => id)} 
                />
              }
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

        <AddTeamProject 
          {...this.props} 
          teamProjects={this.props.team.projects}
          projectLimitIsReached={this.projectLimitIsReached()}
          api={() => this.props.api}
        />
        { this.projectLimitIsReached() &&
          <TeamProjectLimitReachedBanner 
            teamName={this.props.team.name} 
            teamId={this.props.team.id}
            currentUserId={this.props.currentUserId}
            users={this.props.team.users}
          />
        }
        <EntityPageProjects
          projects={this.props.team.projects}
          pins={this.props.team.teamPins}
          isAuthorized={this.props.currentUserIsOnTeam}
          addPin={this.props.addPin}
          removePin={this.props.removePin}
          projectOptions={{removeProjectFromTeam: this.props.removeProject}}
          getProjects={this.props.getProjects}
        />
        
        { (this.props.team.projects.length === 0 && this.props.currentUserIsOnTeam) &&
          <aside className="inline-banners add-project-to-empty-team-banner">
            <div className="description-container">
              <img src={ADD_PROJECT_PALS} alt="add project pals" />
              <div className="description">Add projects to build your team</div>
            </div>
            <AddTeamProject 
              {...this.props}
              extraButtonClass = "button-small"
              teamProjects = {this.props.team.projects}
              api={() => this.props.api}
            />
            </aside>
        }
        
        { this.props.currentUserIsOnTeam &&
          <TeamAnalytics
            api={() => this.props.api}
            id={this.props.team.id}
            currentUserIsOnTeam={this.props.currentUserIsOnTeam}
            projects={this.props.team.projects}
            addProject={this.props.addProject}
            myProjects={this.props.myProjects}
            projectLimitIsReached={this.projectLimitIsReached()}
          /> 
        }
        { (this.props.currentUserIsOnTeam && !this.props.teamHasUnlimitedProjects) && 
          <TeamUpgradeInfoBanner 
            projectsCount={this.props.team.projects.length} 
            limit={FREE_TEAM_PROJECTS_LIMIT} 
            teamName={this.props.team.name} 
            teamId={this.props.team.id} 
            users={this.props.team.users} 
            currentUserId={this.props.currentUserId} 
          />
        }

        {/* billing info section goes here */}

        {/* Temporary: enable once team creation is public
        { currentUserIsTeamAdmin && 
          <DeleteTeam api={() => this.props.api} 
            teamId={this.props.team.id} 
            teamName={this.props.team.name} 
            teamAdmins={this.teamAdmins}
            users={this.props.team.users} 
          /> 
        }
       */}

        { !this.props.currentUserIsOnTeam && 
          <TeamMarketing /> 
        }
      </main>
    );
  }
}

<<<<<<< HEAD
=======
const TeamPage = ({
  team: {
    id, name, description, users,
    projects, teamPins,
    isVerified, verifiedImage, verifiedTooltip,
    backgroundColor, hasAvatarImage,
    coverColor, hasCoverImage,
    _cacheAvatar, _cacheCover,
  },
  currentUserIsOnTeam,
  updateDescription,
  uploadAvatar, uploadCover, clearCover,
  addUser, removeUser,
  addPin, removePin,
  addProject, removeProject,
  api,
}) => (
  <main className="profile-page team-page">
    <section>
      <ProfileContainer
        avatarStyle={getAvatarStyle({id, hasAvatarImage, backgroundColor, cache: _cacheAvatar})}
        coverStyle={getProfileStyle({id, hasCoverImage, coverColor, cache: _cacheCover})}
        avatarButtons={currentUserIsOnTeam ? <ImageButtons name="Avatar" uploadImage={uploadAvatar}/> : null}
        coverButtons={currentUserIsOnTeam ? <ImageButtons name="Cover" uploadImage={uploadCover} clearImage={hasCoverImage ? clearCover : null}/> : null}
      >
        <h1 className="username">
          {name}
          {isVerified && <VerifiedBadge image={verifiedImage} tooltip={verifiedTooltip}/>}
        </h1>
        <div className="users-information">
          <TeamUsers {...{users, currentUserIsOnTeam, removeUser}}/>
          {currentUserIsOnTeam && <AddTeamUser api={api} add={addUser} members={users.map(({id}) => id)}/>}
        </div>
        <Thanks count={users.reduce((total, {thanksCount}) => total + thanksCount, 0)}/>
        <AuthDescription authorized={currentUserIsOnTeam} description={description} update={updateDescription} placeholder="Tell us about your team"/>
      </ProfileContainer>
    </section>
    <AddTeamProject {...{currentUserIsOnTeam, addProject}} teamProjects={projects}/>
    <EntityPageProjects
      api={api} projects={projects} pins={teamPins} isAuthorized={currentUserIsOnTeam}
      addPin={addPin} removePin={removePin} projectOptions={{removeProjectFromTeam: removeProject}}
    />
    {(currentUserIsOnTeam ?
      <TeamAnalytics api={() => api} id={id} currentUserOnTeam={currentUserIsOnTeam} projects={projects}/>
      : <TeamMarketing/>)}
  </main>
);
>>>>>>> 179d7950bb1126424694bb2f6b1ed428e38fc033
TeamPage.propTypes = {
  team: PropTypes.shape({
    _cacheAvatar: PropTypes.number.isRequired,
    _cacheCover: PropTypes.number.isRequired,
    adminIds: PropTypes.array.isRequired,
    backgroundColor: PropTypes.string.isRequired,
    coverColor: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    features: PropTypes.array.isRequired,  
    hasAvatarImage: PropTypes.bool.isRequired,
    hasCoverImage: PropTypes.bool.isRequired,
    id: PropTypes.number.isRequired,
    isVerified: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    projects: PropTypes.array.isRequired,
    teamPins: PropTypes.array.isRequired,
    users: PropTypes.array.isRequired,
    verifiedImage: PropTypes.string.isRequired,
    verifiedTooltip: PropTypes.string.isRequired,
  }),
  addPin: PropTypes.func.isRequired,
  addProject: PropTypes.func.isRequired,
  addUser: PropTypes.func.isRequired,
  api: PropTypes.func.isRequired,
  clearCover: PropTypes.func.isRequired,
  currentUserId: PropTypes.number.isRequired,
  currentUserIsOnTeam: PropTypes.bool.isRequired,
  currentUserIsTeamAdmin: PropTypes.bool.isRequired,
  getProjects: PropTypes.func.isRequired,
  myProjects: PropTypes.array.isRequired,
  removeUser: PropTypes.func.isRequired,
  removePin: PropTypes.func.isRequired,
  removeProject: PropTypes.func.isRequired,
  searchUsers: PropTypes.func.isRequired,
  teamHasUnlimitedProjects: PropTypes.bool.isRequired,
  updateDescription: PropTypes.func.isRequired,
  uploadAvatar: PropTypes.func.isRequired,
  uploadCover: PropTypes.func.isRequired,
};






// Team Page Loader

const TeamPageLoader = ({api, get, name, currentUserModel, ...props}) => (
  <Notifications>
    <DataLoader get={get} renderError={() => <NotFound name={name}/>}>
      {team => team ? (
        <TeamEditor api={api} currentUserModel={currentUserModel} initialTeam={team}>
          {(team, funcs, currentUserIsOnTeam, currentUserIsTeamAdmin) => (
            <TeamPage api={api} team={team} {...funcs} currentUserIsOnTeam={currentUserIsOnTeam} currentUserIsTeamAdmin={currentUserIsTeamAdmin} {...props} />
          )}
        </TeamEditor>
      ) : <NotFound name={name}/>}
    </DataLoader>
  </Notifications>
);

TeamPageLoader.propTypes = {
  get: PropTypes.func.isRequired,
  name: PropTypes.node.isRequired,
};


// Init Team

const ParseTeam = (data) => {
  let ADMIN_ACCESS_LEVEL = 30;
  let adminIds = data.users.filter(user => {
    return user.teamsUser.accessLevel === ADMIN_ACCESS_LEVEL;
  });
  data.adminIds = adminIds.map(user => {
    return user.id;
  });
  return data;
};

export default function(application, id, name) {
  const props = {
    name,
    api: application.api(),
    currentUserId: application.currentUser().id(),
    currentUserModel: application.currentUser(),
    myProjects: application.currentUser().projects().map(({asProps}) => asProps()),
    get: () => 
      application.api().get(`teams/${id}`)
        .then(({data}) => (
          data ? 
            TeamModel(data).update(ParseTeam(data)).asProps() 
            : null
        )),
    searchUsers: (query) => UserModel.getSearchResultsJSON(application, query).then(users => users.map(user => UserModel(user).asProps())),
    getProjects: (ids) => application.api().get(`projects/byIds?ids=${ids.join(',')}`).then(({data}) => data.map(project => ProjectModel(project).update(project).asProps())),
  };
  const content = Reactlet(TeamPageLoader, props, 'teampage');
  return LayoutPresenter(application, content);
}
