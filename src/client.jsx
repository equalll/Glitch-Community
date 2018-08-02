/* globals EDITOR_URL Raven */
import 'details-element-polyfill';

import React from 'react';
import {render} from 'react-dom';

import application from './application';
import rootTeams from './curated/teams.js';

import qs from 'querystringify';
const queryString = qs.parse(window.location.search);

import IndexPage from './presenters/pages/index.jsx';
import CategoryPage from './presenters/pages/category.jsx';
import ProjectPage from './presenters/pages/project.jsx';
import {TeamPage, UserPage, TeamOrUserPage} from './presenters/pages/team-or-user.jsx';
import QuestionsPage from './presenters/pages/questions.jsx';

console.log("#########");
console.log("❓ query strings are", queryString);
console.log("🎏 application is", application);
console.log("👻 current user is", application.currentUser());
console.log("🌈 isSignedIn", application.currentUser().isSignedIn());
console.log("#########");



// client-side routing:

function identifyUser(application) {
  const currentUserId = application.currentUser().id();
  if (currentUserId) {
    application.getCurrentUserById(currentUserId);
  }
  const user = application.currentUser();
  const analytics = window.analytics;
  if (analytics && application.currentUser().isSignedIn()) {
    try {
      analytics.identify(user.id(), {
        name: user.name(),
        login: user.login(),
        email: user.email(),
        created_at: user.createdAt(),
      });
    } catch (error) {
      console.error(error);
      Raven.captureException(error);
    }
  }
}

function routePage(pageUrl, application) {
  // index page ✅
<<<<<<< HEAD:src/client.js
  if ((pageUrl === "index.html") || (pageUrl === "")) {
    application.getQuestions();
    return {page: IndexPage(application)};
  }

  // questions page ✅
  if (pageUrl === 'questions') {
    return {page: QuestionsPage(application), title: "Questions"};
=======
  if (pageUrl.match(/^index\.html$/i) || !pageUrl) {
    return {page: <IndexPage application={application}/>};
  }

  // questions page ✅
  if (pageUrl.match(/^questions$/i)) {
    return {page: <QuestionsPage application={application} title="Questions"/>};
>>>>>>> 179d7950bb1126424694bb2f6b1ed428e38fc033:src/client.jsx
  }

  // ~project overlay page ✅
  if (pageUrl.charAt(0) === '~') {
<<<<<<< HEAD:src/client.js
    const projectDomain = application.removeFirstCharacter(pageUrl);
    const page = ProjectPage(application, projectDomain);
=======
    const projectDomain = pageUrl.substring(1);
    const page = <ProjectPage application={application} name={projectDomain}/>;
>>>>>>> 179d7950bb1126424694bb2f6b1ed428e38fc033:src/client.jsx
    return {page, title:decodeURI(pageUrl)};
  }

  // @name page ✅
  if (pageUrl.charAt(0) === '@') {
<<<<<<< HEAD:src/client.js
    application.pageIsUserPage(true);
    const userLogin = pageUrl.substring(1, pageUrl.length);
    const page = UserPageByLogin(application, userLogin);
=======
    const name = pageUrl.substring(1);
    const page = <TeamOrUserPage application={application} name={name}/>;
>>>>>>> 179d7950bb1126424694bb2f6b1ed428e38fc033:src/client.jsx
    return {page, title:decodeURI(pageUrl)};
  }

  // anon user page ✅
  if (pageUrl.match(/^(user\/)/g)) {
<<<<<<< HEAD:src/client.js
    application.pageIsUserPage(true);
    const userId = application.anonProfileIdFromUrl(pageUrl);
    const page = UserPageById(application, userId);
=======
    const userId = parseInt(pageUrl.replace(/^(user\/)/g, ''), 10);
    const page = <UserPage application={application} id={userId} name={`user ${userId}`}/>;
>>>>>>> 179d7950bb1126424694bb2f6b1ed428e38fc033:src/client.jsx
    return {page, title: pageUrl};
  }

  // root team page ✅
<<<<<<< HEAD:src/client.js
  if (application.getCachedTeamByUrl(pageUrl)) {
    application.pageIsTeamPage(true);
    const team = application.getCachedTeamByUrl(pageUrl);
    const page = TeamPage(application, team.id, team.name);
    return {page, title: team.name};
=======
  if (rootTeams[pageUrl.toLowerCase()]) {
    const page = <TeamPage application={application} id={rootTeams[pageUrl.toLowerCase()]} name={pageUrl}/>;
    return {page, title: pageUrl};
>>>>>>> 179d7950bb1126424694bb2f6b1ed428e38fc033:src/client.jsx
  }

  // search page ✅
  if (pageUrl === 'search' && queryString.q) {
    const query = queryString.q;
    application.searchQuery(query);
    const page = <SearchPage application={application} query={query}/>;
    return {page, title: `Search for ${query}`};
  }

  // category page ✅
  if (application.categories.some(({url}) => pageUrl === url)) {
<<<<<<< HEAD:src/client.js
    application.getCategory(pageUrl);
    const page = CategoryPage(application);
    return {page, title: application.category().name()};
=======
    const category = application.categories.find(({url}) => pageUrl === url);
    const page = <CategoryPage application={application} category={category}/>;
    return {page, title: category.name};
>>>>>>> 179d7950bb1126424694bb2f6b1ed428e38fc033:src/client.jsx
  }
 
  // error page ✅
  return {
    page: <ErrorPage title="Page Not Found" description="Maybe a typo? Or perhaps it's moved?"/>,
    title: "👻 Page not found",
  };
}

<<<<<<< HEAD:src/client.js
function route(location, application) {
  let normalizedRoute = location.pathname.replace(/^\/|\/$/g, "").toLowerCase();
=======
async function route(location, application) {
  const normalizedRoute = location.pathname.replace(/^\/|\/$/g, "");
>>>>>>> 179d7950bb1126424694bb2f6b1ed428e38fc033:src/client.jsx
  console.log(`normalizedRoute is ${normalizedRoute}`);

  //
  // Redirects
  //
  if (location.hash.startsWith("#!/")) {
    window.location = EDITOR_URL + window.location.hash;
    return;
  }
  
  //
  // OAuth Handling
  //
  if (normalizedRoute.startsWith("login/")) {
    const provider = normalizedRoute.substring("login/".length);
    const code = queryString.code;
   
    try {
      await application.login(provider, code);
      window.location.replace("/");
    } catch (error) {
      const errorData = error && error.response && error.response.data;
      const deets = {provider, queryString, error: errorData};
      console.error("OAuth login error.", deets);
      Raven.captureMessage("Oauth login error", {extra: deets});

      document.title = "OAuth Login Error";
      const div = document.createElement('div');
      document.body.appendChild(div);
      render(<ErrorPage title="OAuth Login Problem" description="Hard to say what happened, but we couldn't log you in. Try again?"/>, div);
    }
    return;
  }
  
  //
  // If we have a session, load it and notify our analytics:
  //
  identifyUser(application);
  
  //
  //  Page Routing
  //
  const {page, title=document.title} = routePage(normalizedRoute, application);
  document.title = title;
  const dom = document.createElement('div');
  document.body.appendChild(dom);
  render(page, dom);
}

route(window.location, application);

document.addEventListener("click", event => globalclick(event));
document.addEventListener("touchend", event => globalclick(event));
document.addEventListener("keyup", function(event) {
  const escapeKey = 27;
  const tabKey = 9;
  if (event.keyCode === escapeKey) {
    return application.closeAllPopOvers();
  }
  if (event.keyCode === tabKey) {
    return globalclick(event);
  }
});

var globalclick = function(event) {
  if (!$(event.target).closest('.pop-over, .opens-pop-over, .overlay').length) {
    return application.closeAllPopOvers();
  }
};
