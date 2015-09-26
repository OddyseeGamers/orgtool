import Ember from 'ember';

export default Ember.Route.extend({
  activate: function() {
    this.controllerFor('application').set('showBreadPath', true);
  },

  /*
  model: function() {
    console.debug("RETURN ALL>");
    return this.store.findAll('unit');
  },
  */

  setupController: function(controller, model) {
    console.debug("SET UP CONTROLLER");
//     controller.set('content', this.store.findAll('unit'));
  }
});
