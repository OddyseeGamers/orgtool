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
    console.debug(">>> init rewards");
    var self = this;
    this.store.findAll('rewardType').then(function(types) {
      console.debug("  >", get(types, "length"));
      self.set("rewardTypes", types);
    });
//     get(this, "store").findAll("reward");

//     var self = this;
//     return this.store.findAll("rewardType").then(function(types) {

//       get(this, "model").forEach(function(t) {
//         get(self, "store").findRecord("rewardType", get(t, "id"));
//       });
//     });
//   createRequest: function(name, modelName) {
//     var self = this;
//     return self.get('store').findAll(modelName).then(function(data) {
//       Ember.Logger.log(" loaded ", name, Ember.get(data, 'length'));
//       return data;
//     });
//   },
  }),

/*
  changed: function() {
      console.debug(">>> changed", get(this, "model"), get(this, "model.length"));
      var self = this;
//       if (get(this, "model")) {
//       get(this, "model.rewards").reload();
      get(this, "store").unloadAll();
      get(this, "store").findAll("rewardType").then(function(types) {
        types.forEach(function(t) {
        get(self, "store").unloadAll(t);
//         t.reload();
//         console.debug(">>> changed", get(this, "model"), get(this, "model.length"));
//         get(self, "store").findRecord("rewardType", get(t, "id"));
        });

        get(self, "store").findAll("rewardType").then(function(types) {
          console.debug(">>> reload", get(types, "length")); //, get(this, "model.length"));
          types.forEach(function(t) {
              console.debug(">>>>> reload", get(t, "id")); //, get(this, "model.length"));
            get(self, "store").findRecord("rewardType", get(t, "id"));
          });
        });
      });

//       get(this, "store").findAll("player").then(function(types) {
//         types.forEach(function(t) {
//         get(self, "store").findRecord("rewardType", get(t, "id"));
//         });
//       });

//     Ember.Logger.debug("filter changed", this.get('currFilter'));
  }.observes('model'), //, 'model.rewards'),
*/
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
