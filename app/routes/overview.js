import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;

export default Ember.Route.extend({
  model: function(params) {
    return this.store.findAll('unit');
  },
});
