/* global CDN_URL EDITOR_URL*/

let Project;
const cache = {};

import Team from './team';
import Model from './model';

export const FALLBACK_AVATAR_URL = "https://cdn.glitch.com/c53fd895-ee00-4295-b111-7e024967a033%2Ffallback-project-avatar.svg?1528812220123";

export default Project = function(I, self) {
  
  if (I == null) { I = {}; }
  if (self == null) { self = Model(I); }
  if (cache[I.id]) {
    return cache[I.id];
  }

  self.defaults(I, {
    domain: undefined,
    id: undefined,
    description: undefined,
    teams: undefined,
    users: undefined,
    showAsGlitchTeam: false,
  }
  );

  self.attrObservable(...Array.from(Object.keys(I) || []));
  self.attrObservable("readme", "readmeNotFound", "projectNotFound", "fetched", "displayName", "private");
  self.attrModels('teams', Team);
  self.attrModels('users', User);

  self.extend({

    asProps() {
      const project = self;

      return {
        get teams() { return project.teams().map(team => team.asProps()); },
        get users() { return project.users().map(user => user.asProps()); },
        avatar: project.avatar(),
        description: project.description(),
        domain: project.domain(),
        id: project.id(),
        isPinnedByTeam: project.isPinnedByTeam(application),
        isPinnedByUser: project.isPinnedByUser(application),
        isRecentProject: !!(project.isRecentProject),
        link: getLink(self.domain()),
        name: project.name(),
        private: project.private(),
        showAsGlitchTeam: !!(project.showAsGlitchTeam && project.showAsGlitchTeam()),
      };
    },

    name() {
      return self.domain();
    },

    avatar() {
      return getAvatarUrl(self.id());
    },
  });
      
  cache[I.id] = self;
  // console.log '💎 project cache', cache

  return self;
};

Project.isPinnedByUser = (user, projectId) => {
  const pins = user.pins().map(pin => pin.projectId);
  return pins.includes(projectId);
};

Project.isPinnedByTeam = function(team, projectId) {
  const pins = team.pins().map(pin => pin.projectId);
  return pins.includes(projectId);
};

// Fetch projects and populate them into the local cache
Project.getProjectsByIds = function(api, ids) {
  const NUMBER_OF_PROJECTS_PER_REQUEST = 40;
  const newProjectIds = ids.filter(function(id) {
    const project = cache[id];
    return !project || !project.fetched();
  });
  
  // fetch the ids in groups so they fit into max allowable url length
  const projectIdGroups = newProjectIds.map(function(id, index) {
    if ((index % NUMBER_OF_PROJECTS_PER_REQUEST) === 0) {
      return newProjectIds.slice(index, index + NUMBER_OF_PROJECTS_PER_REQUEST);       
    }  return null; }).filter(id => id);
  
  projectIdGroups.map(function(group) {
    const projectsPath = `projects/byIds?ids=${group.join(',')}`;
    return api.get(projectsPath)
      .then(function({data}) {
        data.map(function(datum) {
          datum.fetched = true;
          return Project(datum).update(datum);
        }); 
      })
      .catch(error => console.error("getProjectsByIds", error));
  });
  
  return ids.map(id => Project({id}));
};

//getProjectsByIds, but wrapped in a promise until they're all fetched.
Project.promiseProjectsByIds = (api, ids) => {
  // Fetch all the project models.
  const projects = Project.getProjectsByIds(api, ids);
  
  // Set up promises to listen to the fetched() state
  const promises = projects.map(project => {
    return new Promise((resolve) => {
      project.fetched.observe((isFetched) => {
        isFetched && resolve();
      });
    });
  });
  
  // Once they all report in as fetched,
  // return the (now populated) original projects object
  return new Promise((resolve) => {
    Promise.all(promises).then(() => {
      return resolve(projects);
    });
  });
};


Project._cache = cache;

export function getAvatarUrl(id) {
  return `${CDN_URL}/project-avatar/${id}.png`;
}

export function getLink(domain) {
  return `/~${domain}`;
}

export function getShowUrl(domain) {
  return `//${domain}.glitch.me`;
}

export function getEditorUrl(domain, path, line, character) {
  if (path && !isNaN(line) && !isNaN(character)) {
    return `${EDITOR_URL}#!/${domain}?path=${path}:${line}:${character}`;
  }
  return `${EDITOR_URL}#!/${domain}`;
}

export function getRemixUrl(domain) {
  return `${EDITOR_URL}#!/remix/${domain}`;
}

// Circular dependencies must go below module.exports
import User from './user';
