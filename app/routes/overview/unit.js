import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;

export default Ember.Route.extend({
  eventManager: Ember.inject.service('events'),
  loader: Ember.inject.service(),
  unit: null,


  model: function(params) {
    set(this, 'unit', get(this, 'loader').getById('unit', params.unit_id));
  },

  afterModel: function(model, transition) {
    var self = this;
    get(this, 'unit').then(function(un) {
      self.controllerFor('overview.unit').set('unit', un);
      self.controllerFor('overview.unit').set('showDialog', true);
    });
  },
});

