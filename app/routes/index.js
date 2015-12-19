import Ember from 'ember';

export default Ember.Route.extend({
  redirect: function() {
    this.transitionTo('overview');
  },

  model: function(params) {
    console.debug("#### return model for index route");
    return {};
  },
  afterModel: function(model, controller) {
    console.debug("#### after model");
    var self = this;
  }
});
