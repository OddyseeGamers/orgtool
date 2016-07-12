import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;

export default Ember.Route.extend({
  eventManager: Ember.inject.service('events'),
  loader: Ember.inject.service(),

  beforeModel: function(transition) {
    this.get('loader').loadThemAll();
  },

  setupController(controller, model) {
    Ember.set(controller, 'models', this.get('loader', 'models'));
  },
});

