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
        self.controllerFor('ships').set('units', unit);
        return unit;
      }),
      shipManufacturer: this.store.findAll('shipManufacturer').then(function(shipManufacturer) {
        self.get('eventManager').trigger('log', "shipManufacturer assignments fetched");
        self.controllerFor('ships').set('shipManufacturers', shipManufacturer);
        return shipManufacturer;
      }),
      shipModel: this.store.findAll('shipModel').then(function(ships) {
        self.get('eventManager').trigger('log', "shipModel fetched");
        self.controllerFor('ships').set('shipModels', ships);
        return ships;
      }),
      unitType: this.store.findAll('unitType').then(function(unitTypes) {
        self.get('eventManager').trigger('log', "unit types fetched");
        self.controllerFor('ships').set('unitTypes', unitTypes);
        return unitTypes;
      }),
      member: this.store.findAll('member').then(function(members) {
        self.get('eventManager').trigger('log', "member fetched");
        self.controllerFor('ships').set('members', members);
        return members;
      }),
      memberUnit: this.store.findAll('memberUnit').then(function(memberUnits) {
        self.get('eventManager').trigger('log', "member assignments fetched");
        self.controllerFor('ships').set('memberUnits', memberUnits);
        return memberUnits;
      }),
      ship: this.store.findAll('ship').then(function(ships) {
        self.get('eventManager').trigger('log', "ships fetched");
        self.controllerFor('ships').set('ships', ships);
        return ships;
      }),
    });

    prom.then(function(done) {
      self.get('eventManager').trigger('success', 'loading done');
    });
  },
});
