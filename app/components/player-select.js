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
      var store = get(this, "store");
      var players = store.peekAll('player');
      var data = this._serializeChildren(players);
      this.set("data", data);
  }),


  _serializeChildren: function(obj) {
      var ret = [];

      obj.forEach(function(mem) {
        ret.push(mem);
      });
      return ret;
  },

  actions: {
    openSelect: function() {
      this.set("showSelect", !this.get("showSelect"));
    },

    applyMember: function(player) {
      if(this.get('onConfirm')) {
        this.get('onConfirm')(player);
      }
      this.set("selVal", null);
    },
  }
});
