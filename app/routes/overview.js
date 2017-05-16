import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;

export default Ember.Route.extend({
//   eventManager: Ember.inject.service('events'),
  session: Ember.inject.service(),

  model: function() {
    console.debug("GET UNITS", get(this, "session.current_user.permission.unit_read"));
    if (get(this, "session.current_user.permission.unit_read")) {
      return this.store.findAll("unit");
    } else {
     return null;
    }
  },

  afterModel: function(model, transition) {
    console.debug("GET PLAYER", get(this, "session.current_user.permission.player_read"));
    if (get(this, "session.current_user.permission.player_read")) {
      this.controllerFor('overview').set('players', this.store.findAll('player'));
    }
  },

//   beforeModel: function(transition) {
//   Ember.Logger.debug("beforemode.......");
//   },

//   setupController(controller, model) {
//   },
});

