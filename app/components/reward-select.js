import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;
var debug = Ember.Logger.log;

export default Ember.Component.extend({
  store: Ember.inject.service(),
  classNames: ['player-select', "dropdown"],
  data: [],
  selVal: null,

  setup: Ember.on('didInsertElement', function() {
//     console.debug("setup reward select", get(this, "rewardType.id"));
    var store = get(this, "store");
    var self = this;
    store.findRecord('rewardType', get(this, "rewardType.id")).then(function(rewType) {
      var data = self._serializeChildren(get(rewType, "rewards"));
      if (!Ember.isEmpty(data)) {
        self.set("data", data);
      }
    });
  }),

  _serializeChildren: function(obj) {
      var ret = [];
      obj.forEach(function(rew) {
        ret.push(rew);
      });
      return ret;
  },

  actions: {
    openSelect: function() {
      this.set("showSelect", !this.get("showSelect"));
    },

    rewardPlayer: function(reward) {
      if(this.get('onConfirm')) {
        this.get('onConfirm')(reward);
      }
      this.set("selVal", null);
    },
  }
});
