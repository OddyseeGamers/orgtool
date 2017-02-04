import Ember from 'ember';

export default Ember.Route.extend({
  eventManager: Ember.inject.service('events'),

  model: function() {
    return this.store.findAll("item");
  },

  afterModel: function(model, transition) {
    this.controllerFor('settings.items').set('itemTypes', this.store.findAll('itemType'));
  },

});
