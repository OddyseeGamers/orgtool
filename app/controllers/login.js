import Ember from 'ember';
import config from '../config/environment';

var get = Ember.get
var set = Ember.set
var debug = Ember.Logger.log

export default Ember.Controller.extend({
  ajax: Ember.inject.service(),

  cred: { email: "", password: "", _csrf_token: window.csrf },
  error: null,
  supporedProviders: [ "identity", "google", "twitter", "slack", "facebook", "github", "microsoft", "discord" ],
  identity: false,
  providers: [],

  setup: Ember.on('init', function() {
    var provs = window.providers;
    if (Ember.isEmpty(provs)) {
      provs = ['identity'];
//       TODO: return?
//       return "";
    }
    var index = provs.indexOf("identity");
    if (index > -1) {
      provs.splice(index, 1);
      set(this, "identity", true);
    }

    var providers = [];
    var self = this;
    provs.forEach(function(provider) {
      if (self.supporedProviders.indexOf(provider) > -1) {
        var icon = self.getIcon(provider);
        providers.push({name: provider, icon: icon });
      }
    });
    set(this, "providers", providers);

  }),

  getIcon: function(provider) {
    switch (provider) {
      case "google": return "google-plus-square";
      case "github": return "github-square";
      case "facebook": return "facebook-square";
      case "slack": return "slack";
      case "twitter": return "twitter-square";
      case "microsoft": return "windows";
      case "discord": return "comments";
    }
    return "question-circle";
  },


  sendRequest: function(data) {
      var prom = this.get('ajax').request('/auth/identity/callback', {
        method: 'POST',
        data: data
      });

      var self = this;
      prom.then(function(done) {
        console.debug("login done", done);
        window.location.href="/";
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
      window.location.href='auth/' + provider;
    }
  }
});
