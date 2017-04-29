import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;

export default Ember.Component.extend({
  classNames: ['fancy-background'],
  session: Ember.inject.service('session'),
  showBG: false,

  setup: Ember.on('didInsertElement', function() {
    if (!localStorage.fancyBG) {
      localStorage.fancyBG = "off";
    }
    set(this, "showBG", localStorage.fancyBG == "on" ? true : false);
    this.setBG();
  }),

  fullName: Ember.observer('showBG', function() {
    this.setBG();
  }),

  setBG: function() {
    if (get(this, "showBG")) {
      localStorage.fancyBG = "on";
      Ember.run.scheduleOnce('afterRender', this, () => {
        Ember.$(".stars").css("background", "#000 url('" + get(this, "session").rootURL + "/stars.png') repeat top center");
        Ember.$(".twinkling").css("background", "transparent url('" + get(this, "session").rootURL + "/twinkling.png') repeat top center");
        Ember.$(".clouds").css("background", "transparent url('" + get(this, "session").rootURL + "/clouds3.png') repeat top center");
      });
    } else {
      localStorage.fancyBG = "off";
    }
  },
});
