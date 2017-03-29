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

  merged: Ember.computed.union('reward.memberRewards', 'reward.memberUnits'),

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
        Ember.Logger.debug("save error", data);
      });
    },

    close: function() {
      this.set('showDialog', false);
    },

    rewardMember: function(member) {
      debug("add member", get(member, 'id'), "to", get(this.get('reward'), 'id'));

      var memrew = get(this, 'store').createRecord('memberReward');
      set(memrew, "member", member);
      set(memrew, "reward", this.get('reward'));
      memrew.save().then(function(done) {
        debug("saved....", get(done, "id"));
      }).catch(function(err) {
        debug("member-reward save failed, err", err);
        memrew.rollbackAttributes();
      });
    },

    showConfirm: function(memUn) {
      set(this, "msg", { "type": "delete", "item": memUn, "title": "Remove Reward", "content": "Do you really want to remove the reward '" + memUn.get("reward.name") + "' from member '" + memUn.get("member.name") + "'?" });
      set(this, "showConfirmDialog", true);
    },

    onConfirmed: function(msg) {
//       Ember.Logger.debug("on confirm");
      var element = get(msg, "item");
      var typename = element.get('constructor.modelName');
//       Ember.Logger.debug("element", typename, "===", element);

      if (element && typename) {
        if (get(msg, "type") == "delete") {
          var self = this;

          element.destroyRecord().then(function(nitem) {
            get(self, "session").log(typename, nitem + " deleted");
//             debug(">>>>>>>>", nitem, self.grouped);
//             self.grouped;
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
