import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;

export default Ember.Route.extend({
  eventManager: Ember.inject.service('events'),
  model: function(params) {
    return this.store.findAll('unit');
  },
  afterModel: function(model, controller) {
    console.debug("==== after model");
    // belongsTo is broken?
//     var self =  this;
  },
  activate: function() {
//     console.debug("==== activate");
//     this.controllerFor('org-chart')._renderStruc();

    console.debug("rerender");
//     this.get('eventManager').trigger('rerender');

  }
});
