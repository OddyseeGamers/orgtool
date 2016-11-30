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
      console.debug("show member", mem.get("name"));
      self.controllerFor('members.member').set('member', mem);
      self.controllerFor('members.member').set('showDialog', !self.controllerFor('members.member').get('showDialog'));
      console.debug("show member done?", self.controllerFor('members.member').get('showDialog'));
    });
  },
});

