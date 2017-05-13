import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;

export default Ember.Route.extend({
  store: Ember.inject.service(),
  model: function() {
    return this.store.findAll("rewardType");
  },

});
