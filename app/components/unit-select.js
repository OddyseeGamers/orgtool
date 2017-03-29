import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;

export default Ember.Component.extend({
  store: Ember.inject.service(),
  classNames: ['unit-select', "dropdown"],
  data: [],
  selVal: null,
  lookup: [],

  setup: Ember.on('didInsertElement', function() {
      var store = get(this, "store");
      var root = store.peekRecord('unit', 1);
      var data = this._serializeChildren(root);
      this.set("data", data.options);
  }),


  _serializeChildren: function(obj) {
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
  },

  actions: {
    openSelect: function() {
      this.set("showSelect", !this.get("showSelect"));
    },

    applyMember: function(num) {
      var uid = this.get("lookup")[num];
//       this.set("showSelect", false);
      if(this.get('onConfirm')) {
        this.get('onConfirm')(uid);
      }
      this.set("selVal", null);
    },
  }
});
