import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;

export default Ember.Service.extend({
  isAdmin: false,
  isUser: false,
//   history: Ember.A(),
  store: Ember.inject.service(),
  user: null,
  loading: true,


  init: function() {
    var self = this;

    self.set('loading', true);
    self.set("state", "authenticate");
    self.set("isUser", false);
    self.set("isAdmin", false);
    self.set("user", null);
    self.set("errors", null);

    return this.get('store').findAll('session').then(function(session) {
      var wp_user = session.get('firstObject').get('user');

      if (Ember.isEmpty(get(wp_user, "id"))) {
        self.set("errors", [ { "attribute": "session", "message": "Something went wrong..." } ]);
        return self.loadThemAll();
      } else {
        self.set("current_user", wp_user);
        self.set("isUser", true);
        return self.get('store').findRecord('member', get(wp_user, "id")).then(function(mem) {
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

    }).catch(function(err) {
      if (err.errors && err.errors[0].status && err.errors[0].status != 401) {
        self.set("errors", err.errors);
      }
      self.log("session", "logged in as visitor");
      return self.loadThemAll();
    });
  },


  loadThemAll: function() {
    var self = this;
    this.set('loading', true);
    self.set("state", null);
    var all = Ember.RSVP.hash({
      members: self.createRequest("members", "member"),
      handles: self.createRequest("handles", "handle"),
      units: this.createRequest("units", "unit"),
      memberUnits: this.createRequest("memberUnits", "memberUnit"),
      unitTypes: self.createRequest("unitTypes", "unitType"),
//
      items: self.createRequest("items", "item"),
      itemTypes: self.createRequest("props", "prop"),
      itemProps: self.createRequest("itemProps", "itemProp"),
      itemTypes: self.createRequest("itemTypes", "itemType"),
    });
    return all.then(function(done) {
          console.debug("loading all done");// , done.get('length'));
          self.set("state", "done");
          self.set('loading', false);
    });
  },

  createRequest: function(name, modelName) {
      var self = this;
      return self.get('store').findAll(modelName).then(function(data) {
        console.debug(" loaded ", name, Ember.get(data, 'length'));
//         self.set(name, data);
        self.set("state", name);
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
