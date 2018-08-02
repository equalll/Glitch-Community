let User;

import Model from './model';
const cache = {};
const cacheBuster = Math.floor(Math.random() * 1000);

export const ANON_AVATAR_URL = "https://cdn.glitch.com/f6949da2-781d-4fd5-81e6-1fdd56350165%2Fanon-user-on-project-avatar.svg?1488556279399";

export default User = function(I, self) {

  if (I == null) { I = {}; }
  if (self == null) { self = Model(I); }
  if (cache[I.id]) {
    return cache[I.id];
  }
  
  self.defaults(I, {
    id: undefined,
    avatarUrl: undefined,
    avatarThumbnailUrl: undefined,
    color: undefined,
    hasCoverImage: false,
    coverColor: "#1F33D9",
    login: null,
    name: null,
    description: "",
    projects: undefined,
    teams: [],
    thanksCount: 0,
    fetched: false,
    showAsGlitchTeam: false,
    persistentToken: null,
    pins: [],
    deletedProjects: [],
  });

  self.attrObservable(...Array.from(Object.keys(I) || []));
  self.attrObservable("notFound");
  self.attrObservable("localCoverImage");
  self.attrModels('projects', Project);

  self.extend({

    isSignedIn() {
      return !!self.login();
    },

    isAnon() {
      return !self.login();
    },

    isAnExperiencedUser() {
      if (self.login() && (self.projects().length > 1)) {
        return true;
      }
    },

    coverUrl(size='large') {
      if (self.localCoverImage()) {
        return self.localCoverImage();
      } 

      if (self.hasCoverImage()) {
        return `https://s3.amazonaws.com/production-assetsbucket-8ljvyr1xczmb/user-cover/${self.id()}/${size}?${cacheBuster}`;
      } 
      return "https://cdn.glitch.com/55f8497b-3334-43ca-851e-6c9780082244%2Fdefault-cover-wide.svg?1503518400625";
      
    },
    
    profileStyle() {
      return {
        backgroundColor: self.coverColor(),
        backgroundImage: `url('${self.coverUrl()}')`,
      };
    },

    avatarStyle() {
      return {
        backgroundColor: self.color(),
        backgroundImage: `url('${self.userAvatarUrl('large')}')`,
      };
    },

    userAvatarUrl(size) {
      size = size || 'small';
      if (self.isAnon() || !self.avatarUrl()) {
        return self.anonAvatar();
      }
      if (size === "large") {
        return self.avatarUrl();
      }
      return self.avatarThumbnailUrl();
    },

    isCurrentUser(application) {
      return self.id() === application.currentUser().id();
    },

<<<<<<< HEAD
    isOnUserPageForCurrentUser(application) {
      return !!(application.pageIsUserPage() && self.isCurrentUser(application));
    },

    hiddenIfSignedIn() {
      if (self.isSignedIn()) { return 'hidden'; }
    },

    hiddenUnlessSignedIn() {
      if (!self.isSignedIn()) { return 'hidden'; }
    },

    //
    // hiddenIfAnon: ->
    //   'hidden' if self.isAnon()

    hiddenIfFetched() {
      if (self.fetched()) { return 'hidden'; }
    },

    hiddenUnlessFetched() {
      if (!self.fetched()) { return 'hidden'; }
    },

=======
>>>>>>> 179d7950bb1126424694bb2f6b1ed428e38fc033
    tooltipName() {
      return self.login() || "anonymous user";
    },
    
    alt() {
      return `${I.login} avatar`;
    },
    
    style() {
      return {backgroundColor: I.color};
    },
    
    userLink() {
      if (self.isSignedIn()) {
        return `/@${I.login}`;
      } 
      return `/user/${I.id}`;
      
    },

    anonAvatar() {
      return ANON_AVATAR_URL;
    },

    glitchTeamAvatar() {
      return "https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fglitch-team-avatar.svg";
    },
    
    asProps() {
      return {
        get teams() { return self.teams.filter(({asProps}) => !!asProps).map(({asProps}) => asProps()); },
        get projects() { return self.projects.filter(({asProps}) => !!asProps).map(({asProps}) => asProps()); },
        get pins() { return self.pins(); },

        alt: self.alt(),
        avatarUrl: self.avatarUrl(),
        color: self.color(),
        coverColor: self.coverColor(),
        coverUrlSmall: self.coverUrl('small'),
        description: self.description(),
        hasCoverImage: self.hasCoverImage(),
        id: self.id(),
        isAnon: self.isAnon(),
        login: self.login(),
        name: self.name(),
        style: self.style(),
        profileStyle: self.profileStyle(),
        avatarStyle: self.avatarStyle(),
        thanksCount: self.thanksCount(),
        tooltipName: self.tooltipName(),
        userAvatarUrl: self.userAvatarUrl(),
        userAvatarUrlLarge: self.userAvatarUrl('large'),
        userLink: self.userLink(),
        
      };
    },
  });


  if (I.id) {
    cache[I.id] = self;
  }
  // console.log '☎️ user cache', cache

  return self;
};

User.getUserByLogin = function(application, login) {
  const userIdPath = `/userid/byLogin/${login}`;
  return application.api().get(userIdPath)
    .then(function(response) {
      const userId = response.data;
      if (userId === "NOT FOUND") {
        application.user().notFound(true);
        return;
      }
      return User.getUserById(application, userId);
    }).catch(error => console.error(`getUserByLogin GET ${userIdPath}`, error));
};

User.getUserById = function(application, id) {
  const userPath = `users/${id}`;
  const promise = new Promise((resolve, reject) => {
    return application.api().get(userPath)
      .then(({data}) => resolve(data)).catch(function(error) {
        console.error(`getUserById GET ${userPath}`, error);
        return reject();
      });
  });
  return promise;
};


User._cache = cache;

export function getAvatarStyle({avatarUrl, color}) {
  return {
    backgroundColor: color,
    backgroundImage: `url('${avatarUrl || ANON_AVATAR_URL}')`,
  };
}

export function getProfileStyle({id, hasCoverImage, coverColor, cache=cacheBuster}) {
  const customImage = `https://s3.amazonaws.com/production-assetsbucket-8ljvyr1xczmb/user-cover/${id}/large?${cache}`;
  const defaultImage = "https://cdn.glitch.com/55f8497b-3334-43ca-851e-6c9780082244%2Fdefault-cover-wide.svg?1503518400625";
  return {
    backgroundColor: coverColor,
    backgroundImage: `url('${hasCoverImage ? customImage : defaultImage}')`,
  };
}

// Circular dependencies must go below module.exports
import Project from './project';
