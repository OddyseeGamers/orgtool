import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;

export default Ember.Route.extend({
  eventManager: Ember.inject.service('events'),
  loader: Ember.inject.service(),
  member: null,

  model: function(params) {
    set(this, 'member', get(this, 'loader').getById('member', params.member_id));
  },

  afterModel: function(model, transition) {
    var self = this;
    get(this, 'member').then(function(mem) {
      self.controllerFor('members.member').set('model', mem);
    });
  },
});

