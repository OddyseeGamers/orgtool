import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;

export default Ember.Route.extend({
//   redirect: function(model, transition) {
//     console.debug("TRANSITION 1", transition.targetName)
//   },

  model: function(params) {
//     console.debug("first");
    return this.store.findRecord('member', params.member_id);
  },

  afterModel: function(model, transition) {
    var ctrl = this.controllerFor('members.member');
    ctrl.set('showDialog', true);
//     console.debug("hmm?");
  },
//   setupController: function(controller, model) {
//     console.debug("what");
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

