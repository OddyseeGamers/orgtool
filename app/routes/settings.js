import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;
var log = Ember.Logger.log;

export default Ember.Route.extend({
  session: Ember.inject.service(),
//   redirect: function(model, transition) {
//     if (!Ember.get(this, "session").get("isAdmin")) {
//       transition.abort();
//     }
//   },
});
