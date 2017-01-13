import Ember from 'ember';

export default Ember.Route.extend({
  eventManager: Ember.inject.service('events'),
  loader: Ember.inject.service(),

  model: function() {
    return this.store.findAll("item");
  },

  afterModel: function(model, transition) {
    this.controllerFor('items').set('itemTypes', this.store.findAll('itemType'));
  },

});
