import Ember from 'ember';

export default Ember.Route.extend({
  loader: Ember.inject.service(),

  beforeModel: function(transition) {
    console.debug("app route load all");
    this.get('loader').loadThemAll();
  },
});
