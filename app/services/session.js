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
    Ember.Logger.log(">>> init >>>> session");
    this._super(...arguments);
    this.loadUser();
  },

  loadUser: function() {
    var self = this;
    self.set('current_user', null);

    Ember.Logger.log(">>> init >>>> loadUser, jwt", !Ember.isEmpty(window.jwt), "csrf", !Ember.isEmpty(window.csrf));

    var scripts = document.getElementsByTagName("script");
    var filename = "assets/orgtool.js";
    for (var i = 0; i < scripts.length; i++) {
      var src = scripts[i].src;
      if (src.indexOf(filename) > 0) {
        self.set('rootURL', src.substring(0, src.indexOf(filename)));
        break;
      }
    }

    return new Ember.RSVP.Promise(function(resolve, reject) {
      // fix path to assets in wordpress
      var session;
      if (Ember.isEmpty(window.jwt)) {
  //       self.setUser({"sub": "User:0"}, null);
      } else {
        session = self.parseJwt(window.jwt);
      }

//       if (config.environment === 'development') {
//         session = {"sub": "User:1"};
//       }

      if (!Ember.isEmpty(session) && !Ember.isEmpty(get(session, "sub"))) {
        var userid = session.sub.split(':')[1];
        Ember.Logger.log("find user", userid);
        return self.get('store').findRecord('user', userid).then(function(user) {
          Ember.Logger.log(" user found", userid);

          self.set("current_user", user);
          if (!Ember.isEmpty(get(user, "player").get("id"))) {
            set(get(user, "player"), "loggedIn", true);
          }
          self.log("session", "logged in as user");
          self.set('loading', false);
          resolve();
        }).catch(function(err) {
          Ember.Logger.log("error", err);
          self.set('loading', false);
          reject();
        });
      } else {
        Ember.Logger.log(">>> init >>>> NO session");
        self.set('loading', false);
        resolve();
      }
    });
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
      self.set("current_user", user);
      if (!Ember.isEmpty(get(user, "player").get("id"))) {
        set(get(user, "player"), "loggedIn", true);
      }
        self.log("session", "logged in as user");
        self.set('loading', false);
    } else {
        self.log("session", "logged in as guest");
        self.set('loading', false);
    }
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
