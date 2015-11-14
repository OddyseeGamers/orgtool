import Ember from 'ember';

export default Ember.Route.extend({

  model: function() {
    return this.store.findAll('ship');
//     return this.store.findAll('shipManufacturer');

//     return this.store.findAll('ship').then(function(ship){
//       console.log("ship, force fetch manu" , ship.get('manufacturer'));
//       return ship;
//     });
  },

  afterModel: function(model, controller) {
    // belongsTo is broken?
    this.store.findAll('shipManufacturer');
  }

});
