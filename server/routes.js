const express = require('express');
const fs = require('fs');
const util = require('util');
const dayjs = require('dayjs');

const {getProject, getTeam, getUser, getZine} = require('./api');
const constants = require('./constants');

module.exports = function(external) {

  const app = express.Router();

  // CORS - Allow pages from any domain to make requests to our API
  app.use(function(request, response, next) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    return next();
  });

  // Caching - js and CSS files have a hash in their name, so they last a long time
  ['/*.js', '/*.css'].forEach((path) => (
    app.use(path, (request, response, next) => {
      const s = dayjs.convert(1, 'month', 'seconds');
      response.header('Cache-Control', `public, max-age=${s}`);
      return next();
    })
  ));

  app.use(express.static('public', { index: false }));

  // Log all requests for diagnostics
  app.use(function(request, response, next) {
    console.log(request.method, request.originalUrl, request.body);
    return next();
  });

  const readFilePromise = util.promisify(fs.readFile);
  const imageDefault = 'https://cdn.gomix.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fsocial-card%402x.png';
  async function render(res, title, description, image=imageDefault) {
    let built = true;
    
    const zine = await getZine() || [];
    
    let scripts = {};
    try {
      scripts = JSON.parse(await readFilePromise('public/scripts.json'));
    } catch (error) {
      console.error("Failed to load script manifest");
      built = false;
    }
    let styles = {};
    try {
      styles = JSON.parse(await readFilePromise('public/styles.json'));
    } catch (error) {
      console.error("Failed to load style manifest");
      built = false;
    }
    
    if (!built) {
      console.error("The initial build probably isn't ready yet");
    }
    
    res.render('index.ejs', {
      title, description, image,
      scripts: Object.values(scripts),
      styles: Object.values(styles),
      BUILD_COMPLETE: built,
      EXTERNAL_ROUTES: JSON.stringify(external),
      ZINE_POSTS: JSON.stringify(zine),
      PROJECT_DOMAIN: process.env.PROJECT_DOMAIN,
      ENVIRONMENT: process.env.NODE_ENV || "dev",
      CONSTANTS: constants,
    });
  }

  const {CDN_URL} = constants.current;

  app.get('/~:domain', async (req, res) => {
    const {domain} = req.params;
    const project = await getProject(domain);
    if (!project) {
      await render(res, domain, `We couldn't find ~${domain}`);
      return;
    }
    const avatar = `${CDN_URL}/project-avatar/${project.id}.png`;
    await render(res, domain, project.description, avatar);
  });

  app.get('/@:name', async (req, res) => {
    const {name} = req.params;
    const team = await getTeam(name);
    if (team) {
      await render(res, team.name, team.description);
      return;
    }
    const user = await getUser(name);
    if (user) {
      await render(res, user.name || `@${user.login}`, user.description, user.avatarThumbnailUrl);
      return;
    }
    await render(res, `@${name}`, `We couldn't find @${name}`);
  });

  app.get('*', async (req, res) => {
    await render(res,
      "Glitch",
      "The friendly community where everyone can discover & create the best stuff on the web");
  });

  return app;
};
