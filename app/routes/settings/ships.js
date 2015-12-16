import Ember from 'ember';

export default Ember.Route.extend({

  model: function() {
    this.store.findAll('shipManufacturer');
    return this.store.findAll('shipModel');
  },

});
