import Ember from 'ember';

export default Ember.Route.extend({
  loader: Ember.inject.service(),

//   beforeModel: function(transition) {
//     this.get('loader').loadThemAll();
//   },

//   afterModel: function(model, transition) {
//     console.debug("APP AFTER MODEL", transition.targetName);
//   },
});
