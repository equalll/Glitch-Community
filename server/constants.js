// Define a bunch of variables based on our environment

let APP_URL = 'https://glitch.com';
let API_URL = 'https://api.glitch.com/';
let EDITOR_URL = 'https://glitch.com/edit/';
let CDN_URL = 'https://cdn.glitch.com';
let GITHUB_CLIENT_ID = "b4cb743ed07e20abf0b2";
let FACEBOOK_CLIENT_ID = "660180164153542";
let BILLING_SERVICE_URL = "https://stripe-plans.glitch.me/"

if (process.env.RUNNING_ON === 'staging') {
  APP_URL = 'https://staging.glitch.com';
  API_URL = 'https://api.staging.glitch.com/';
  EDITOR_URL = 'https://staging.glitch.com/edit/';
  CDN_URL = 'https://cdn.staging.glitch.com';
  GITHUB_CLIENT_ID = "65efbd87382354ca25e7";
  FACEBOOK_CLIENT_ID = "1858825521057112";
}

module.exports = {
  APP_URL,
  API_URL,
  EDITOR_URL,
  CDN_URL,
  GITHUB_CLIENT_ID,
  FACEBOOK_CLIENT_ID,
};