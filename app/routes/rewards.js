import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;

export default Ember.Route.extend({
  store: Ember.inject.service(),
  model: function() {
    return this.store.findAll("reward");
  },

  afterModel: function(model, transition) {
    model.forEach(function(reward) {
      reward.reload();
    });
  },

});
