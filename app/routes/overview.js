import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;

export default Ember.Route.extend({
  eventManager: Ember.inject.service('events'),

  model: function(params) {
    var self = this;
    self.get('eventManager').trigger('setLoading', true);
    self.get('eventManager').trigger('log', "fetching units");
    return this.store.findAll('unit');
  },

  afterModel: function(model, transition) {
    var self = this;
  
//     console.debug(">>> after overview model, filter:", get(this.controllerFor('org-chart'), 'currFilter'));
    var prom = Ember.RSVP.hash({
      orgtype: this.store.queryRecord('unitType', { filter: { name: 'org' } }).then(function(orgType) {
        self.controllerFor('overview').set('orgType', orgType);
        self.get('eventManager').trigger('log', "org type found");
        return orgType;
      }),
      unitType: this.store.findAll('unitType').then(function(unitTypes) {
        self.controllerFor('overview').set('unitTypes', unitTypes);
        self.controllerFor('application').set('unitTypes', unitTypes);
        self.get('eventManager').trigger('log', "unit types fetched");
        return unitTypes;
      }),
      member: this.store.findAll('member').then(function(members) {
        self.controllerFor('overview').set('members', members);
        self.get('eventManager').trigger('log', "member fetched");
        return members;
      }),
      memberUnit: this.store.findAll('memberUnit').then(function(memberUnits) {
        self.controllerFor('overview').set('memberUnits', memberUnits);
        self.get('eventManager').trigger('log', "member assignments fetched");
        return memberUnits;
      }),
      ship: this.store.findAll('ship').then(function(ships) {
        self.controllerFor('overview').set('ships', ships);
        self.get('eventManager').trigger('log', "ships fetched");
        return ships;
      }),
    });

    prom.then(function(done) {
      self.get('eventManager').trigger('success', 'loading done');
      self.get('eventManager').trigger('rerender');
    });
  },
  activate: function() {
    this.controllerFor('overview').set('currentUnit', null);
  }
});

