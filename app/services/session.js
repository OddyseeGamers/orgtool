import Ember from 'ember';
import config from '../config/environment';

var get = Ember.get;
var set = Ember.set;

export default Ember.Service.extend({
  isAdmin: false,
  isUser: false,
  store: Ember.inject.service(),
  user: null,
  loading: true,
  statesDone: 16,
  state: Ember.A(),
  fancyBG: false,

  init: function() {
//     Ember.debug("session:", config.environment);
    var self = this;

    self.set('loading', true);
    get(self, "state").pushObject("connecting");
    self.set("isUser", false);
    self.set("isAdmin", false);
    self.set("user", null);
    self.set("errors", null);

    var _session = this.get('store').createRecord('session');
    return _session.save().then(function(session) {
      return self.loadSession(session);
    }).catch(function(err) {
      self.set("statesDone", 14);
      get(self, "state").pushObject("guest");
      if (err.errors && err.errors[0].status && err.errors[0].status != 401) {
        self.set("errors", err.errors);
      }

      self.log("session", "logged in as visitor");
      return self.loadThemAll();
    });
  },

  loadSession: function(session) {
      var wp_user = session.get('user');
      var self = this;
      get(self, "state").pushObject("permissions");
      if (Ember.isEmpty(get(wp_user, "id"))) {
        self.set("errors", [ { "attribute": "session", "message": "Something went wrong..." } ]);
        return self.loadThemAll();
      } else {
        self.set("current_user", wp_user);
        self.set("isUser", true);
        get(self, "state").pushObject(get(wp_user, "display_name"));
        return self.get('store').findRecord('member', get(wp_user, "id")).then(function(mem) {
          get(self, "state").pushObject("gotcha");
          mem.set("loggedIn", true);
          self.set("user", mem);

          if(get(wp_user, 'isadmin')) {
            self.set("isAdmin", true);
            self.log("session", "logged in as admin");
          } else {
            self.log("session", "logged in as user");
          }

          return self.loadThemAll();
        });
      }
  },


  loadThemAll: function() {
    var self = this;
    this.set('loading', true);
    
    var all = Ember.RSVP.hash({
      members: self.createRequest("members", "member"),
      handles: self.createRequest("handles", "handle"),
      units: this.createRequest("units", "unit"),
      items: self.createRequest("items", "item"),
      props: self.createRequest("props", "prop"),
      itemProps: self.createRequest("itemProps", "itemProp"),

      rewards: self.createRequest("rewards", "reward"),
      memberUnits: self.createRequest("memberUnits", "memberUnit"),
      unitTypes: self.createRequest("unitTypes", "unitType"),
      itemTypes: self.createRequest("itemTypes", "itemType"),
      rewardTypes: self.createRequest("rewardTypes", "rewardType"),
    });
    return all.then(function(done) {
      Ember.Logger.log("loading all done");
      get(self, "state").pushObject("done");
      self.set('loading', false);

//       return Ember.RSVP.hash({
//       });
    });
  },

  createRequest: function(name, modelName) {
      var self = this;
      return self.get('store').findAll(modelName).then(function(data) {
        Ember.Logger.log(" loaded ", name, Ember.get(data, 'length'));
        get(self, "state").pushObject(name);
        return data;
      });
  },

  log: function(comp, msg) {
    var d = new Date();
    var timestamp = d.getMonth() + "/" + d.getDay() + "/" + d.getFullYear() + " " + d.getHours() + " " + d.getMinutes() + ":" + d.getSeconds();
    var log = Ember.get(this, "store").createRecord('log');
    Ember.set(log, "timestamp", timestamp);
    Ember.set(log, "comp", comp);
    Ember.set(log, "msg", msg);
  },
});
