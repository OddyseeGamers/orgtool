import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;

export default Ember.Route.extend({
//   eventManager: Ember.inject.service('events'),
//   loader: Ember.inject.service(),
//   unit: null,


  model: function(params) {
    return this.store.findRecord('unit', params.unit_id);
  },

  afterModel: function(model, transition) {
    this.controllerFor('overview.unit').set('unitTypes', this.store.findAll('unitType'));
    this.controllerFor('overview.unit').set('showDialog', true);
  },
});

