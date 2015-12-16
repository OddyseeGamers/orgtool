import Ember from 'ember';

export default Ember.Route.extend({

  model: function() {
    this.store.findAll('member');
    this.store.findAll('shipManufacturer');
    this.store.findAll('shipModel');
    return this.store.findAll('ship');
  },

//   afterModel: function(model, controller) {
//     belongsTo is broken?
//     this.store.findAll('ship');
//   }

});
