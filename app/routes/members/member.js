import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;

export default Ember.Route.extend({
//   redirect: function(model, transition) {
//     Ember.Logger.debug("TRANSITION 1", transition.targetName)
//   },

  model: function(params) {
//     Ember.Logger.debug("first");
    return this.store.findRecord('member', params.member_id);
  },

  afterModel: function(model, transition) {
    var ctrl = this.controllerFor('members.member');
    ctrl.set('showDialog', true);
//     Ember.Logger.debug("hmm?");
  },
//   setupController: function(controller, model) {
//     Ember.Logger.debug("what");
//     controller.setProperties(model);
//   },

  actions: {
    addHandle: function(member) {
      var handle = this.store.createRecord('handle');
      handle.set('member', member);
      this.controllerFor('members.member').set('currHandle', handle);
      this.controllerFor('members.member').set('showHandleDialog', true);
    },

    editHandle: function(handle) {
      this.controllerFor('members.member').set('currHandle', handle);
      this.controllerFor('members.member').set('showHandleDialog', true);
    },

  }
});

