import Ember from 'ember';

export default Ember.Route.extend({

  model: function() {
    return this.store.findAll('shipModel');
//     return this.store.findAll('shipCollection');
//     return this.store.findAll('shipManufacturer');
//     return this.store.findAll('shipManufacturer');

//     return this.store.findAll('shipCollection').then(function(ship){
//       var arr = ship.get('content');
//       console.log("ship, force fetch manu" , arr);
//       arr.forEach(function (record) {
//         console.log("  >> " , record.a('name'));
//       });
//       return ship;
//     });
  },

//   afterModel: function(model, controller) {
//     belongsTo is broken?
//     this.store.findAll('ship');
//     this.store.findAll('member');
//     this.store.findAll('unit');
//   }

});
