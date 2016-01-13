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
      ship: this.store.findAll('ship').then(function(ships) {
        self.get('eventManager').trigger('log', "ships fetched");
        self.controllerFor('ships').set('ships', ships);
        return ships;
      }),
      shipModel: this.store.findAll('shipModel').then(function(ships) {
        self.get('eventManager').trigger('log', "ship models fetched");
        return ships;
      }),
      shipManufacturer: this.store.findAll('shipManufacturer').then(function(shipManufacturer) {
        self.get('eventManager').trigger('log', "ship manufacturers fetched");
        return shipManufacturer;
      }),
      shipClass: this.store.findAll('shipClass').then(function(classes) {
        self.get('eventManager').trigger('log', "ship classes fetched");
        return classes;
      }),
    });

    prom.then(function(done) {
      self.get('eventManager').trigger('success', 'loading done');
    });
  }

});
