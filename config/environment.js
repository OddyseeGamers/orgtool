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
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },

/*
    contentSecurityPolicy: {
      'connect-src': "'self' http://www.oddysee.org http://www.oddysee.org:4200",
      'img-src': "'self' http://www.oddysee.org http://www.oddysee.org:4200 robertsspaceindustries.com",
      'style-src': "'unsafe-inline'",
    }
*/

    contentSecurityPolicy: {
      'default-src': "http://www.oddysee.org",
      'script-src': "'self' http://www.oddysee.org http://www.oddysee.org:4200 'unsafe-eval'",
      'font-src': "'self' http://fonts.gstatic.com http://www.oddysee.org:4200 http://fonts.googleapis.com",
      'connect-src': "'self' http://www.oddysee.org http://www.oddysee.org:4200",
      'img-src': "*",
      'style-src': "'self' 'unsafe-inline'",
      'report-uri':"'self'"
    }

  };

  if (environment === 'development') {
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
