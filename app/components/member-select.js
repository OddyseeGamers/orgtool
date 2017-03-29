import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;
var debug = Ember.Logger.debug;

export default Ember.Component.extend({
  store: Ember.inject.service(),
  classNames: ['member-select', "dropdown"],
  data: [],
  selVal: null,
  lookup: [],

//   initDone: false,
  setup: Ember.on('didInsertElement', function() {
//       Ember.Logger.debug(">> init", this.data, "-", this.lookup, "-", this.selVal, "-", this.initDone);
//       this.set("lookup", []);
      var store = get(this, "store");
      var members = store.peekAll('member');
      var data = this._serializeChildren(members);
      this.set("data", data);
//       this.set("initDone", true);
//       Ember.Logger.debug("hmmm?");
  }),

//   names: ["1", "2"],

//   cleanup: Ember.on('didDestroyElement', function() {
//     Ember.Logger.debug(">> cleanup")
//       Ember.Logger.debug(">> init", this.data, "-", this.lookup, "-", this.selVal);
//   }),

  _serializeChildren: function(obj) {
      var ret = [];

      obj.forEach(function(mem) {
        ret.push(mem);
//         ret.push({id: get(mem, "id"), name: get(mem, "name"), avatar: get(mem, "avatar")});
      });
      return ret;

    /*
    var self = this;
    if (obj) {
      if (!get(obj, 'units').get("length")) {
        self.lookup[obj.get("name")] = obj.get("id");
        return obj.get("name");
      }

      var ret = { groupName: obj.get("name") };
      ret.id = get(obj, 'id');
      get(obj, 'units').forEach(function(unit) {
        var unit_ser = { groupName: unit.get("name") };
        self.lookup[unit.get("name")] = unit.get("id");
        if (!ret.options) {
          ret.options = [unit_ser];
        } else {
          ret.options.push(unit_ser);
        }
        ret.options[ret.options.length - 1] = self._serializeChildren(unit);
      });
    }
    return ret;
    */
  },

  actions: {
    openSelect: function() {
      this.set("showSelect", !this.get("showSelect"));
    },

    applyMember: function(member) {
//       debug("apply member", get(member, "id"));
      if(this.get('onConfirm')) {
        this.get('onConfirm')(member);
      }
    },
  }
});
