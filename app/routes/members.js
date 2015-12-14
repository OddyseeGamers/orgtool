import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
//       if (!this.get('members') || this.get('members.length') === 0) {
//       var mems =  this.store.peekAll('member');
//       console.debug(">> members", get(mems, 'length'));
//     }
//     return this.store.findAll('member');
    return this.store.peekAll('member');
  },
//   afterModel: function(model, controller) {
    // belongsTo is broken?
//     this.store.findAll('unit');
//     this.store.findAll('ship');
//     this.store.findAll('shipManufacturer');
//   }

});
