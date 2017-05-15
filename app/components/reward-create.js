import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;
var debug = Ember.Logger.debug

export default Ember.Component.extend({
  classNames: ['reward-create'],
  store: Ember.inject.service(),
  session: Ember.inject.service('session'),
  showDialog: false,
  requiredFields: Ember.computed.and('reward.name.length', 'reward.level'),
  columns: [100],
  itemHeight: 39,

  merged: Ember.computed.union('reward.players'),

  setup: Ember.on('init', function() {
  }),

  actions: {
    deleteReward:function() {
      get(this, 'onConfirm')(get(this, "reward"));
    },
    saveReward:function() {
      var self = this;
      var r = this.get("reward");
      r.save().then(function(data) {
        self.set('showDialog', false);
      }).catch(function(err) {
       debug("save error", err);
      });
    },

    close: function() {
      this.set('showDialog', false);
    },

    rewardMember: function(player) {
      debug("add player", get(player, 'id'), "to", get(this.get('reward'), 'id'));
      get(player, "rewards").pushObject(this.get('reward'));
      var self = this;
      player.save().then(function(done) {
        get(self, "session").log("player", "added reward " + get(self, "reward.name") + " to player " + get(player, "name"));
      }).catch(function(err) {
        debug("player-reward save failed, err", err);
      });
    },

    showConfirm: function(player) {
      set(this, "msg", { "type": "delete", "item": player, "title": "Remove Reward", "content": "Do you really want to remove the reward '" + get(this, "reward.name") + "' from player '" + get(player, "name") + "'?" });
      set(this, "showConfirmDialog", true);
    },

    onConfirmed: function(msg) {
      var element = get(msg, "item");
      var typename = element.get('constructor.modelName');
//       Ember.Logger.debug("element", typename, "===", element);

      if (element && typename) {
        if (get(msg, "type") == "delete") {
          var self = this;
          element.get("rewards").removeObject(get(this, "reward"));
          element.save().then(function(nitem) {
//             debug(">>>>>>>>", nitem);
            get(self, "session").log(typename, "removed reward " + get(self, "reward.name") + " form player " + get(element, "name"));
          }).catch(function(err) {
            get(self, "session").log("error", "could not delete " + typename + " " + element.get("name"));
            Ember.Logger.debug("error deleting", err);
          }).finally(function() {
            set(self, "showConfirmDialog", false);
          });
        }
      } else {
        set(this, "showConfirmDialog", false);
      }
    },


  }
});
