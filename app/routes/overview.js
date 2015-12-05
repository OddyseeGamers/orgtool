import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
//     console.debug("find units", params);
    return this.store.findAll('unit');
  },

  setupController: function(controller, model) {
    console.debug("SET UP CONTROLLER", model);
//     controller.set('content', model);
    controller.set('units', model);
//     controller.set('members', model.members);
  }

//   model: function(params) {
//     return Ember.RSVP.hash({
//       units: this.store.findAll('unit'),
//       members: this.store.findAll('member')
//     });
//   },

//   setupController: function(controller, model) {
//     console.debug("SET UP CONTROLLER", model);
//     controller.set('units', model.units);
//     controller.set('members', model.members);
//   }
//  model: function() {
//     return this.store.findAll('unit');
//   },
//   afterModel: function(model, controller) {
//     belongsTo is broken?
//     this.store.findAll('member');
//   }
});
