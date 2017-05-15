import Ember from 'ember';

var debug = Ember.Logger.log

export default Ember.Controller.extend({
  ajax: Ember.inject.service(),
  providers: [
    {"name": "Oddysee",  "link": "auth/oddysee",   "icon": "",         "img": "https://www.oddysee.org/wp-content/plugins/orgtool-wordpress-plugin/orgtool/dist/oddysee-logo-glow.png"},
    {"name": "Google",   "link": "auth/google",    "icon": "google",   "img": null},
    {"name": "Github",   "link": "auth/github",    "icon": "github",   "img": null},
    {"name": "Facebook", "link": "auth/facebook",  "icon": "facebook", "img": null},
    {"name": "Slack",    "link": "auth/slack",     "icon": "slack",    "img": null}
  ],
  cred: { email: "", password: "" },

  actions: {
    login: function() {
      debug("login", get(this, "cred"));
      var prom = this.get('ajax').request('/auth/identity', {
        method: 'POST',
        data: get(this, "cred")
      });

      var self = this;
      prom.then(function(done) {
        console.debug("PROM done", done);
        self.transitionToRoute('/');
      });

    },

    loginProvider: function(provider) {
      debug("loginProvider", provider);
      window.location.href=provider;
      return;


//       if (provider == "google") {
//       } else if (provider == "google") {
//         debug("google");
//       }
    }
  }


//   store: Ember.inject.service(),
//   model: []

//   columns: [20, 20, 20, 20, 20],
//   itemHeight: 500,
//   itemWidth: 400,
//   itemSizes: { width: 400, height: 500},
//   itemHeight
//   filteredShips: Ember.computed.filterBy('content', 'player', ),
//   setup: Ember.on('init', function() {
//     this.set('content', this.store.findAll('shipCollection'));
//     this.set('ships', this.store.findAll('ship'));
//   }),
});
