import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;

export default Ember.Route.extend({
  eventManager: Ember.inject.service('events'),

  model: function(params) {
    var self = this;
    self.get('eventManager').trigger('setLoading', true);
    self.get('eventManager').trigger('log', "fetching units");
    return this.store.findAll('member');
  },

  afterModel: function(model, transition) {
    var self = this;
    var prom = Ember.RSVP.hash({
      unit: this.store.findAll('unit').then(function(units) {
        self.controllerFor('overview').set('units', units);
        var cid = self.controllerFor('overview').get('currentUnit');
        if (!cid) {
          var curr = self.store.peekRecord('unit', 1);
          self.controllerFor('overview').set('currentUnit', curr);
          self.controllerFor('overview').set('currentChart', curr);
        }
        self.get('eventManager').trigger('log', "member fetched");
      }),
      unitType: this.store.findAll('unitType').then(function(unitTypes) {
        self.controllerFor('overview').set('unitTypes', unitTypes);
        self.controllerFor('application').set('unitTypes', unitTypes);
        self.get('eventManager').trigger('log', "unit types fetched");
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
      Ember.run.next(self, function() {
        self.get('eventManager').trigger('rerender');
//         self.get('eventManager').trigger('setDetails', { unitid: 2, extended: true, sync: true});
      });
    });
  },
//   activate: function() {
//   }
});

