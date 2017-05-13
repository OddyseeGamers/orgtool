import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;

export default Ember.Route.extend({
  session: Ember.inject.service(),

  beforeModel: function(transition) {
//     Ember.Logger.log(">>> app route >>>> beforemodel", transition);
//     if (!get(this, "session.current_user")) {
//       Ember.Logger.log(">>> app route >>>> beforemodel - has no user");
//       this.transitionTo('login');
//     } else {
//     }
//       this.transitionTo('overview');
//     Ember.Logger.log(">>> app route >>>> beforemodel ->");

    Ember.get(this, "session");
//
//     Ember.Logger.log(">>> app route >>>> beforemodel", Ember.get(this, "session"));
//     Ember.get(this, "session");
//   },
//   redirect: function() {

//     Ember.Logger.log(">>> app route >>>> redirect");
//     this.transitionTo('overview');
  },



//   afterModel: function(model, transition) {
//     Ember.Logger.debug("APP AFTER MODEL", transition.targetName);
//   },
//
//     actions: {
//       willTransition(transition) {
//         Ember.Logger.log(">>> app route >>>> willTransition");
//       },
//       didTransition() {
//         Ember.Logger.log(">>> app route >>>> didTransition");
//       }
//   }
//
//       this.controller.get('errors.base').clear();

//  Ember.run.scheduleOnce('afterRender', this, () => {
//     Ember.Logger.log(">>>>>>> INIT TR");
//     Ember.$(".stars").css("background", "#000 url('/stars.png') repeat top center");
//     Ember.Logger.log(">>>>>>> INIT TR", Ember.$(".stars").css("background"));
//   });

//       return true; // Bubble the didTransition event
//     }
//   }
});
