// console.debug(">>> import ...");
import Ember from 'ember';
import Resolver from 'ember-resolver';
import loadInitializers from 'ember/load-initializers';
import config from './config/environment';

// console.debug(">>> import done ...");

let App;

Ember.MODEL_FACTORY_INJECTIONS = true;

App = Ember.Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver: Resolver,
  rootElement: '#orgtool-container'
});

// console.debug(">>> init ...");
loadInitializers(App, config.modulePrefix);
// console.debug(">>> init done ...");


export default App;
