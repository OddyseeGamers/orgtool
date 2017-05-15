import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;

export default Ember.Controller.extend({
  classNames: ['rewards'],
  session: Ember.inject.service(),
  store: Ember.inject.service(),
  showRTDialog: false,
  showRewardDialog: false,

  sortProperties: ['numericLevel:asc'],
  sortedRewardTypes: Ember.computed.sort('rewardTypes', 'sortProperties'),

  setup: Ember.on('init', function() {
    var self = this;
    this.store.findAll('rewardType').then(function(types) {
      self.set("rewardTypes", types);
    });
  }),

  actions: {
    createRewardType: function() {
      var rt = this.store.createRecord('rewardType');
      this.set("currType", rt);
      this.set("showRTDialog", true);
    },

    editRewardType: function(rt) {
      this.set("currType", rt);
      this.set("showRTDialog", true);
    },

    createReward: function(rt) {
      var r = this.store.createRecord('reward');
      r.set('rewardType', rt);
      this.set("currReward", r);
      this.set("showRewardDialog", true);
    },

    editReward: function(r) {
      this.set("currReward", r);
      this.set("showRewardDialog", true);
    },

    showConfirmType: function(item) {
      set(this, "msg", { "type": "delete", "item": item, "title": "Delete Reward Type!", "content": "Do you really want to delete the reward type " + item.get("name") + "?" });
      set(this, "showConfirmDialog", true);
    },

    showConfirmReward: function(item) {
      set(this, "msg", { "type": "delete", "item": item, "title": "Delete Reward!", "content": "Do you really want to delete the reward " + item.get("name") + "?" });
      set(this, "showConfirmDialog", true);
    },

    onConfirmed: function(msg) {
      Ember.Logger.debug("on confirm");
      var element = get(msg, "item");
      var typename = element.get('constructor.modelName');
      Ember.Logger.debug("element type", typename);

      if (element && typename) {
        if (get(msg, "type") == "delete") {
          var self = this;
          element.destroyRecord().then(function(nitem) {
            get(self, "session").log(typename, nitem.get("name") + " deleted");
          }).catch(function(err) {
            get(self, "session").log("error", "could not delete " + typename + " " + element.get("name"));
            Ember.Logger.debug("error deleting", err);
          }).finally(function() {
            set(self, "currType", null);
            set(self, "showConfirmDialog", false);
            set(self, "showRTDialog", false);
            set(self, "showRewardDialog", false);
          });
        }
      } else {
        set(this, "currType", null);
        set(this, "showConfirmDialog", false);
        set(this, "showRTDialog", false);
        set(this, "showRewardDialog", false);
      }
    }
  }
});
