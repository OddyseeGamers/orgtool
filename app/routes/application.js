import Ember from 'ember';

export default Ember.Route.extend({
  session: Ember.inject.service(),

  beforeModel: function(transition) {
//     Ember.Logger.log(">>>>>>> BEF TR", Ember.get(this, "session"));
    Ember.get(this, "session");
  },

//   afterModel: function(model, transition) {
//     Ember.Logger.debug("APP AFTER MODEL", transition.targetName);
//   },
//
//     actions: {
//     didTransition() {
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
