import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;

export default Ember.Route.extend({
  session: Ember.inject.service(),
//   store: Ember.inject.service(),

//   model: function(params) {
//     return this.store.peekAll('log');
//   },
//
//
  beforeModel: function(transition) {
    Ember.Logger.log(">>> login route >>>> beforemodel");
    if (!get(this, "session.current_user")) {
      Ember.Logger.log(">>> login route >>>> beforemodel - has no user");
//       this.transitionTo('login');
    }
    Ember.Logger.log(">>> login route >>>> beforemodel ->");

//     Ember.get(this, "session");
//
//     Ember.Logger.log(">>> app route >>>> beforemodel", Ember.get(this, "session"));
//     Ember.get(this, "session");
  },
  redirect: function() {

    Ember.Logger.log(">>> login route >>>> redirect");
//     this.transitionTo('overview');
  },



//   afterModel: function(model, transition) {
//     Ember.Logger.debug("APP AFTER MODEL", transition.targetName);
//   },
//
    actions: {
      willTransition(transition) {
        Ember.Logger.log(">>> login route >>>> willTransition");
      },
      didTransition() {
        Ember.Logger.log(">>> login route >>>> didTransition");
      }
  }
});

