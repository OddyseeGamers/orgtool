import Ember from 'ember';

export default Ember.Route.extend({
  activate: function() {
    this.controllerFor('application').set('showBreadPath', true);
  },
  model: function() {
    return this.store.findAll('unit');
  },
});
