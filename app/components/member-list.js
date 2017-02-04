import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;

export default Ember.Component.extend({
  classNames: ['member-filtered-list'],
  sortProperties: ['numericID'],
  details: false,
  showEdit: false,
  session: Ember.inject.service('session'),
  store: Ember.inject.service(),
  eventManager: Ember.inject.service('events'),
  unitFilter: null,
  columns: [100],
  itemHeight: 39,

  hasParent: function(id, unit) {
    try {
      return unit.get("id") == id || unit.get('parent') && this.hasParent(id, unit.get('parent'));
    } catch(err) {
        console.debug("error", err);
    }
    return false;
  },

  filteredContent: Ember.computed.filter('members', function(member, index, array) {
    var searchFilter = this.get('searchFilter');
    var unitFilter = this.get('unitFilter');
    var res = []

    if (Ember.isEmpty(searchFilter) && Ember.isEmpty(unitFilter)) {
      return true;
    }


    if (!Ember.isEmpty(searchFilter)) {
      var regex = new RegExp(searchFilter, 'i');

      if (get(member, "name").match(regex)) {
        return true;
      }

      var handles;
      var all = get(member, 'handles');
      for (var i = 0; i < get(all, 'length'); i++) {
        if (all.objectAt(i).get("handle").match(regex)) {
          return true;
        }
      }

      return false;
    }


    if (!Ember.isEmpty(unitFilter)) {
      var self = this;
      res = member.get('memberUnits').filter(function(item, index, enumerable){
        return self.hasParent(unitFilter.get("id"), item.get('unit'));
      });
      if (Ember.isEmpty(res)) {
        return false;
      }
    }

    return res;
  }).property('searchFilter', 'members.length', 'unitFilter'),

  sortedContent: Ember.computed.sort('filteredContent', 'sortProperties').property('filteredContent'),

  setup: Ember.on('didInsertElement', function() {
    var self = this;
    get(this, 'store').findRecord('unit', 1).then(function(unit) {
      self.set('rootUnit', unit);
    });
  }),


  actions: {
    setUnitFilter: function(data) {
//       console.debug("set ", data);
      set(this, 'unitFilter', data);
    },

    clearFilter: function() {
//       console.debug("clear");
      this.set('searchFilter', '');
    },

  }
});
