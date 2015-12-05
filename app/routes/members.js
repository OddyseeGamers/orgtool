import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return this.store.findAll('member');
  },
//   afterModel: function(model, controller) {
    // belongsTo is broken?
//     this.store.findAll('unit');
//     this.store.findAll('ship');
//     this.store.findAll('shipManufacturer');
//   }

});
