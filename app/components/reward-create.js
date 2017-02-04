import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;

export default Ember.Component.extend({
  classNames: ['reward-create'],
  store: Ember.inject.service(),
  session: Ember.inject.service('session'),
  showDialog: false,
  requiredFields: Ember.computed.and('reward.name.length', 'reward.level'),

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
        console.debug("save error", data);
      });
    },

    close: function() {
      this.set('showDialog', false);
    },
  }
});
