import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;
var debug = Ember.Logger.log;

export default Ember.Component.extend({
  store: Ember.inject.service(),
  classNames: ['member-select', "dropdown"],
  data: [],
  selVal: null,

  setup: Ember.on('didInsertElement', function() {
      var store = get(this, "store");
      var members = store.peekAll('member');
      var data = this._serializeChildren(members);
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

    applyMember: function(member) {
      if(this.get('onConfirm')) {
        this.get('onConfirm')(member);
      }
      this.set("selVal", null);
    },
  }
});
