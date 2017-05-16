import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;

export default Ember.Route.extend({
  session: Ember.inject.service(),

  beforeModel: function(transition) {
    Ember.get(this, "session");
  },

  actions: {
    willTransition(transition) {
      var target = transition.targetName.split(".")[0];

      if (Ember.isEmpty(get(this, "session.current_user")) && target != "overview") {
        transition.abort();
        return false;
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

      transition.abort();
    }
  }

});
