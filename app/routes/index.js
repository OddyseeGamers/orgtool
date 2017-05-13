import Ember from 'ember';

export default Ember.Route.extend({
//   beforeModel: function(transition) {
//     Ember.Logger.log(">>> index route >>>> beforemodel");
//   },

  redirect: function() {
//     Ember.Logger.log(">>> index route >>>> redirect");
    this.transitionTo('overview');
  },
});
