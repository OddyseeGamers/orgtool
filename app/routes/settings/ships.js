import Ember from 'ember';

export default Ember.Route.extend({

  model: function() {
    this.store.findAll('shipModel');
    return this.store.findAll('shipManufacturer');
  },

});
