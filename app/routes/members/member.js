import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;

export default Ember.Route.extend({
//   eventManager: Ember.inject.service('events'),
//   loader: Ember.inject.service(),
//   member: null,

  model: function(params) {
    return this.store.findRecord('member', params.member_id);
  },

  afterModel: function(model, transition) {
//     this.controllerFor('members.member').set('member', model);
//     this.controllerFor('members.member').set('showDialog', !this.controllerFor('members.member').get('showDialog'));
    this.controllerFor('members.member').set('showDialog', true);
  },
});

