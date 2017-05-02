/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'orgtool',
    environment: environment,
//     baseURL: '/',
//     locationType: 'auto',
//     locationType: 'none',
//     baseURL: null,
    rootURL: null,
    locationType: 'hash',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
      API_HOST: ''
    },

//     moment: {
//       includeLocales: true
//     },
    moment: {
      includeTimezone: 'all'
    },

/*
    contentSecurityPolicy: {
      'connect-src': "'self' http://www.oddysee.org http://www.oddysee.org:4200",
      'img-src': "'self' http://www.oddysee.org http://www.oddysee.org:4200 robertsspaceindustries.com",
      'style-src': "'unsafe-inline'",
    }
*/

    contentSecurityPolicy: {
      'default-src': "https://www.oddysee.org",
      'script-src': "'self' https://www.oddysee.org 'unsafe-eval'",
      'font-src': "'self' https://fonts.gstatic.com http://fonts.googleapis.com",
      'connect-src': "'self' https://www.oddysee.org",
      'img-src': "*",
      'style-src': "'self' 'unsafe-inline'",
      'report-uri':"'self'"
    }

  };

  if (environment === 'development') {
    // ENV.APP.API_HOST = 'https://oddysee.org'
    ENV.APP.API_HOST = 'http://localhost:4000'
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
//     ENV.baseURL = '/';
    ENV.rootURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {
  }

  return ENV;
};
