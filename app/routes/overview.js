import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;

export default Ember.Route.extend({
  eventManager: Ember.inject.service('events'),
  model: function(params) {
    return this.store.findAll('unit');
  },
//   afterModel: function(model, controller) {
    // belongsTo is broken?
//     var self =  this;
//   }
});
