import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;

export default Ember.Component.extend({
  classNames: ['fancy-background'],
  session: Ember.inject.service('session'),

  setup: Ember.on('didInsertElement', function() {
    this.setBG();
  }),

  fullName: Ember.observer('show', function() {
    this.setBG();
  }),

  setBG: function() {
    if (get(this, "show")) {
      Ember.run.scheduleOnce('afterRender', this, () => {
        Ember.$(".stars").css("background", "#000 url('" + get(this, "session").rootURL + "/stars.png') repeat top center");
        Ember.$(".twinkling").css("background", "transparent url('" + get(this, "session").rootURL + "/twinkling.png') repeat top center");
        Ember.$(".clouds").css("background", "transparent url('" + get(this, "session").rootURL + "/clouds3.png') repeat top center");
      });
    }
  },
});
