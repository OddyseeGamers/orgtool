import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;

export default Ember.Route.extend({
  session: Ember.inject.service(),

//   beforeModel: function(transition) {
//     if (!get(this, "session.current_user")) {
//     }
//   },

//   redirect: function() {
//   },

});

