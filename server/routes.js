const express = require('express');
const fs = require('fs');
const moment = require('moment-mini');

const {getProject, getUser} = require('./api');
const {updateCaches} = require('./cache');
const constants = require('./constants');

module.exports = function() {
  
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
      const s = moment.duration(1, 'months').asSeconds();
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

  app.post('/update-caches', async (request, response) => {
    await updateCaches();
    response.sendStatus(200);
  });

  const imageDefault = 'https://cdn.gomix.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fsocial-card%402x.png';

  function render(res, title, description, image=imageDefault) {
    const scripts = JSON.parse(fs.readFileSync('public/scripts.json'));
    const styles = JSON.parse(fs.readFileSync('public/styles.json'));

    res.render('index.ejs', {
      title, description, image,
      scripts: Object.values(scripts),
      styles: Object.values(styles),
      PROJECT_DOMAIN: process.env.PROJECT_DOMAIN,
      ENVIRONMENT: process.env.NODE_ENV || "dev",
      ...constants,
    });
  }
  
  const {CDN_URL} = constants;
  
  app.get('/~:domain', async (req, res) => {
    const {domain} = req.params;
    const project = await getProject(domain);
    if (!project) {
      return render(res, domain, `We couldn't find ~${domain}`);
    }
    const avatar = `${CDN_URL}/project-avatar/${project.id}.png`;
    render(res, domain, project.description, avatar);
  });
  
  app.get('/@:name', async (req, res) => {
    const {name} = req.params;
    const user = await getUser(name);
    if (!user) {
      return render(res, `@${name}`, `We couldn't find @${name}`);
    }
    render(res, user.name, user.description, user.avatarThumbnailUrl);
  });

  app.get('*', (req, res) => {
    render(res,
      "Glitch - The Friendly, Creative Community",
      "The friendly community where you’ll build the app of your dreams");
  });
  
  return app;
};
