import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;

export default Ember.Route.extend({
//   eventManager: Ember.inject.service('events'),

  model: function() {
    return this.store.findAll("unit");
  },

  afterModel: function(model, transition) {
    this.controllerFor('overview').set('members', this.store.findAll('member'));
  },

//   beforeModel: function(transition) {
//   Ember.Logger.debug("beforemode.......");
//   },

//   setupController(controller, model) {
//   },
});

