import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;

export default Ember.Route.extend({
  redirect: function(model, transition) {
    this.transitionTo('settings.items');
  },
});

