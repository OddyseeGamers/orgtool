import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;

export default Ember.Route.extend({
//   store: Ember.inject.service('store'),
//   loader: Ember.inject.service(),

  model: function() {
    return this.store.findAll("member");
  },

//   model: function() {
//     return this.store.findAll('member');
//   },

//   setupController(controller, model) {
//     Ember.set(controller, 'models', this.get('loader', 'models'));
//   },

});
