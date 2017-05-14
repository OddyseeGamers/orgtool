import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;

export default Ember.Component.extend({
  classNames: ['reward-type-create'],
  store: Ember.inject.service(),
  session: Ember.inject.service('session'),
  showDialog: false,
  requiredFields: Ember.computed.and('rt.name', 'rt.level'),

  setup: Ember.on('init', function() {
  }),

  actions: {
    deleteRewardType:function() {
      get(this, 'onConfirm')(get(this, "rt"));
    },
    saveRewardType:function() {
      var self = this;
      var rt = this.get("rt");
      rt.save().then(function(data) {
        Ember.Logger.debug("save ok", data);
        self.set('showDialog', false);
      }).catch(function(err) {
        Ember.Logger.debug("save error", err);
      });
    },
    close: function() {
      this.set('showDialog', false);
    },
  }
});
