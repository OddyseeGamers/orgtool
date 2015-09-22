import Ember from 'ember';

export default Ember.Route.extend({
  activate: function() {
    console.debug("enter members");
    this.controllerFor('application').set('showBreadPath', false);
  },
  model: function() {
    return this.store.peekAll('unit');
  },
});
