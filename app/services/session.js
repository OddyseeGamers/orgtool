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
  current_user: null,

  init: function() {
//     Ember.Logger.log(">>> init >>>> session");
    var self = this;
//     self.set('loading', true);
    self.set('current_user', null);

    // fix path to assets in wordpress
    var scripts = document.getElementsByTagName("script");
    var filename = "assets/orgtool.js";
    for (var i = 0; i < scripts.length; i++) {
      var src = scripts[i].src;
      if (src.indexOf(filename) > 0) {
        self.set('rootURL', src.substring(0, src.indexOf(filename)));
        break;
      }
    }

    var session;
    if (Ember.isEmpty(window.jwt)) {
      self.setUser({"sub": "User:0"}, null);
//       self.set('loading', false);
    } else {
      session = this.parseJwt(window.jwt);
    }

    if (config.environment === 'development') {
      session = {"sub": "User:1"};
    }

    
//     && !Ember.isEmpty(get(session, "sub"))) {

    if (!Ember.isEmpty(session) && !Ember.isEmpty(get(session, "sub"))) {
      var userid = session.sub.split(':')[1];
      Ember.Logger.log("session", session);
      return self.get('store').findRecord('user', userid).then(function(user) {
        self.setUser(session, user);
      }).catch(function(err) {
        Ember.Logger.log("error", err);
        self.setUser({"sub": "User:0", "display_name": "Guest", "user_login": "guest", "isadmin": false}, null);
//       }).finally(function(){
//         self.set('loading', false);
      });
    } else {
        self.setUser({"sub": "User:0", "display_name": "Guest", "user_login": "guest", "isadmin": false}, null);
//         self.set('loading', false);
    }
  },


  parseJwt: function(token) {
    if (!Ember.isEmpty(token)) {
      var base64Url = token.split('.')[1];
      var base64 = base64Url.replace('-', '+').replace('_', '/');
      return JSON.parse(window.atob(base64));
    }
    return null;
  },

  setUser: function(session, user) {
    var self = this;
    if (!Ember.isEmpty(user)) {
//       mem.set("loggedIn", true);
      self.set("current_user", user);
//       Ember.Logger.log(">>> USER", user.serialize());
      Ember.Logger.log("Player ID:", get(user, "player").get("id"));
      Ember.Logger.log("Perm ID:", get(user, "permission").get("id"));
      if (!Ember.isEmpty(get(user, "player").get("id"))) {
        set(get(user, "player"), "loggedIn", true);
      }

//       self.set("user", mem);
//       self.set("isUser", true);
//       self.set("current_user.id", get(mem, "id"));

//       if(get(user, 'permission.')) {
//         self.log("session", "logged in as admin");
//       } else {
        self.log("session", "logged in as user");
//       }
    } else {
        self.log("session", "logged in as guest");
    }
    self.set('loading', false);
  },

  loadSession: function(session) {
      var wp_user = session.get('user');
      var self = this;
//       get(self, "state").pushObject("permissions");
      if (Ember.isEmpty(get(wp_user, "id"))) {
        self.set("errors", [ { "attribute": "session", "message": "Something went wrong..." } ]);
        return self.loadThemAll();
      } else {
        self.set("current_user", wp_user);
        self.set("isUser", true);

        get(self, "state").pushObject(get(wp_user, "display_name"));
        return self.get('store').findRecord('player', get(wp_user, "id")).then(function(mem) {
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
      players: self.createRequest("players", "player"),
      handles: self.createRequest("handles", "handle"),
      units: self.createRequest("units", "unit"),
      items: self.createRequest("items", "item"),
      categories: self.createRequest("categories", "category"),
      templates: self.createRequest("templates", "template"),
      item_props: self.createRequest("item_props", "item_prop"),
      template_props: self.createRequest("template_props", "template_prop"),

      rewards: self.createRequest("rewards", "reward"),
      unitTypes: self.createRequest("unitTypes", "unitType"),

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
