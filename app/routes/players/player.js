import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;

export default Ember.Route.extend({
//   redirect: function(model, transition) {
//     Ember.Logger.debug("TRANSITION 1", transition.targetName)
//   },

  model: function(params) {
//     Ember.Logger.debug("first");
    return this.store.findRecord('player', params.player_id);
  },

  afterModel: function(model, transition) {
    var ctrl = this.controllerFor('players.player');
    ctrl.set('showDialog', true);
//     Ember.Logger.debug("hmm?");
  },
//   setupController: function(controller, model) {
//     Ember.Logger.debug("what");
//     controller.setProperties(model);
//   },

  actions: {
    addHandle: function(player) {
      var handle = this.store.createRecord('handle');
      handle.set('player', player);
      this.controllerFor('players.player').set('currHandle', handle);
      this.controllerFor('players.player').set('showHandleDialog', true);
    },

    editHandle: function(handle) {
      this.controllerFor('players.player').set('currHandle', handle);
      this.controllerFor('players.player').set('showHandleDialog', true);
    },

  }
});

