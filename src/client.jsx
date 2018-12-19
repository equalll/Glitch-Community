/* globals EDITOR_URL */

// Import Sentry early to help it initialize.
import {configureScope} from './utils/sentry';
import './polyfills.js';

// Init our dayjs plugins
import dayjs from 'dayjs';
import relativeTimePlugin from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTimePlugin);
import convertPlugin from '../shared/dayjs-convert';
dayjs.extend(convertPlugin);

import React from 'react';
import {render} from 'react-dom';
import App from './app.jsx';

// Here's a bunch of browser support tests
// If any of them don't work we can't run in this browser
/* eslint-disable no-unused-vars */
let x = {a: 1, b: 2}; // Can we use let?
const y = [1, 2, 3]; // Can we use const?
const {a, ...aRest} = x; // Can we use object destructuring?
const [b, ...bRest] = y; // Can we use array destructuring?
const str = `${b}23`; // Can we use formatted strings?
const func = (f, ...args) => f(...args); // Can we define arrow functions?
func(async arg => await arg, Promise.resolve()); // Can we do async/await?
new URLSearchParams(); // Do we have URLSearchParams? 
/* eslint-enable no-unused-vars */


// Assuming none of them threw, set the global bootstrap function.
// This will get used to check for compatibility in index.ejs
// If it isn't there, the browser is unsupported.
window.bootstrap = () => {
  if (location.hash.startsWith("#!/")) {
    window.location.replace(EDITOR_URL + window.location.hash);
    return;
  }
  
  // Mark that bootstrapping has occurred,
  // ..and more importantly, use this as an excuse
  // to call into Sentry so that its initialization
  // happens early in our JS bundle.
  configureScope((scope) => {
    scope.setTag("bootstrap", "true");
  });
    
  const dom = document.createElement('div');
  document.body.appendChild(dom);
  render(<App/>, dom);
};