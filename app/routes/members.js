import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;

export default Ember.Route.extend({
  eventManager: Ember.inject.service('events'),

  model: function() {
    var self = this;
    self.get('eventManager').trigger('setLoading', true);
    self.get('eventManager').trigger('log', "fetching members");
    return this.store.findAll('member');
  },

  afterModel: function(model, transition) {
    var self = this;
    var prom = Ember.RSVP.hash({
      units: this.store.findAll('unit').then(function(unit) {
        self.get('eventManager').trigger('log', "units fetched");
      }),
      memberUnit: this.store.findAll('memberUnit').then(function(memberUnits) {
        self.get('eventManager').trigger('log', "member assignments fetched");
      }),
      ship: this.store.findAll('ship').then(function(ships) {
        self.get('eventManager').trigger('log', "ships fetched");
      }),
    });

    prom.then(function(done) {
      self.get('eventManager').trigger('success', 'loading done');
//       self.get('eventManager').trigger('resizeMembers');
    });
  },

});
