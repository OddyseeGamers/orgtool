import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;

export default Ember.Route.extend({
  session: Ember.inject.service(),

  beforeModel: function(transition){
    console.debug("GET SESSIN FIRST!");
    var self = this;
    return this.get('session').loadUser().then(function(result) {
      var target = transition.targetName.split(".")[0];
      if (target !== 'login' && target !== "overview") {
        const session = self.get('session');
        console.debug("GET SESSIN RETURNED", session.current_user);
        if (!session.current_user) {
          self.transitionTo('overview');
        }
      }
    });
  }, 

//   beforeModel: function(transition) {
//     Ember.get(this, "session");
//   },

  actions: {
    willTransition(transition) {
      var target = transition.targetName.split(".")[0];

      console.debug("ABBORT ?", target, Ember.isEmpty(get(this, "session.current_user")), "-",(target != "overview" || target != "login") );
      if (Ember.isEmpty(get(this, "session.current_user")) && (target == "overview" || target == "login")) {
//        console.debug("ABBORT 1");
//        transition.abort();
        return true;
      }

      var perms = get(this, "session.current_user.permission");
      switch(target) {
        case "overview":
            return true;
        case "players":
          if (get(perms, "player_read")) {
            return true;
          }
        case "items":
          if (get(perms, "item_read")) {
            return true;
          }
        case "rewards":
          if (get(perms, "reward_read")) {
            return true;
          }
        case "users":
          if (get(perms, "user_read")) {
            return true;
          }
        case "log":
          if (get(perms, "settings")) {
            return true;
          }
      }

      console.debug("ABBORT !!!");
      transition.abort();
    }
  }

});
