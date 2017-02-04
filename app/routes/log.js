import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;

export default Ember.Route.extend({
  session: Ember.inject.service(),
  store: Ember.inject.service(),

  model: function(params) {
    return this.store.peekAll('log');
  },
});

