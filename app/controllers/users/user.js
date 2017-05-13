import Ember from 'ember';
// import App from '../../app';
// import Moment from 'moment';

var get = Ember.get;
var set = Ember.set;
var debug = Ember.Logger.debug;

export default Ember.Controller.extend({
  store: Ember.inject.service(),
  eventManager: Ember.inject.service('events'),
  session: Ember.inject.service('session'),
  showDialog: false,
  def: [
    { name: "read", short: "r" },
    { name: "create", short: "c" },
    { name: "edit", short: "e" },
    { name: "delete", short: "d" }
  ],
  un: [
    { name: "apply", short: "ap" },
    { name: "accept", short: "ac" },
    { name: "assign", short: "as" }
  ],
  sec: [],

  setup: Ember.on('init', function() {
    var perms = get(this, 'session.current_user.permission');
    set(this, "sec", [
      { name: "user", prop: this.def },
      { name: "player", prop: this.def },
      { name: "unit", prop: this.def.concat(this.un) },
      { name: "category", prop: this.def },
      { name: "template", prop: this.def },
      { name: "item", prop: this.def },
      { name: "reward", prop: this.def }
    ]);
  }),
  changed: function() {
      console.debug(">>> changed", get(this, "model"), get(this, "model.length"));
  }.observes('model'),

  actions: {
    deleteUser:function(user) {
//       get(this, 'onConfirm')(get(this, "reward"));
    },
    saveUser:function(user) {
      var self = this;
//       var r = this.get("reward");

//       get(user, "permission").save().then(function(data) {
//         self.set('showDialog', false);
//       }).catch(function(err) {
//        debug("save error", err);
//       });

      user.save().then(function(data) {
        self.set('showDialog', false);
      }).catch(function(err) {
       debug("save error", err);
      });
    },

    close: function() {
//       Ember.Logger.debug("the other close...");
      this.set('showDialog', false);
//       this.transitionToRoute('players');
    }
  }
});
