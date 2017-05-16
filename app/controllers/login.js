import Ember from 'ember';
import config from '../config/environment';

var get = Ember.get
var set = Ember.set
var debug = Ember.Logger.log

export default Ember.Controller.extend({
  ajax: Ember.inject.service(),
  providers: [
//     {"name": "Oddysee",  "link": "auth/oddysee",   "icon": "",         "img": "https://www.oddysee.org/wp-content/plugins/orgtool-wordpress-plugin/orgtool/dist/oddysee-logo-glow.png"},
    {"name": "Google",   "link": "auth/google",    "icon": "google-plus-square", "img": null},
    {"name": "Github",   "link": "auth/github",    "icon": "github-square",      "img": null},
    {"name": "Facebook", "link": "auth/facebook",  "icon": "facebook-square",    "img": null},
    {"name": "Slack",    "link": "auth/slack",     "icon": "slack",              "img": null}
  ],
  cred: { email: "", password: "", _csrf_token: window.csrf },
  error: null,
  

  sendRequest: function(data) {
      var prom = this.get('ajax').request('/auth/identity/callback', {
        method: 'POST',
        data: data
      });

      var self = this;
      prom.then(function(done) {
        console.debug("login done");
//         self.transitionToRoute('/');
//         window.location.href="/";
      }).catch(function(err) {
        console.debug("login err", err);
        set(self, "error", err);
//         window.location.href="/";
      });
  },

  actions: {
    setSignup: function() {
      set(this, "sign", { name: "", email: "", password: "", password_confirmation: "", _csrf_token: window.csrf });
    },

    unsetSignup: function() {
      set(this, "sign", null);
    },

    register: function() {
      this.sendRequest(get(this, "sign"));
    },

    login: function() {
      this.sendRequest(get(this, "cred"));
    },

    loginProvider: function(provider) {
      debug("loginProvider", provider);
      window.location.href=provider;
      return;
    }
  }
});
