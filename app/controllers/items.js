import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;

export default Ember.Controller.extend({
  classNames: ['item-filtered-list'],
  store: Ember.inject.service(),
//   model: []
  gameFilter: null,
//   columns: [100],
//   itemHeight: 39,

  columns: [16.6, 16.6, 16.6, 16.6, 16.6, 16.6],
  itemHeight: 150,

  hasParent: function(id, unit) {
    try {
      return unit.get("id") == id || unit.get('parent') && this.hasParent(id, unit.get('parent'));
    } catch(err) {
        console.debug("error", err);
    }
    return false;
  },

  filteredContent: Ember.computed.filter('models.items', function(item, index, array) {
    var searchFilter = this.get('searchFilter');
    var gameFilter = this.get('gameFilter');
    var res = []

    if (Ember.isEmpty(gameFilter)) {
      return true;
    }

    if (gameFilter == "unset" && Ember.isEmpty(item.get('unit'))) {
      return true;
    }

    if (Ember.isEmpty(item.get('unit'))) {
      return false;
    }

//     if (!Ember.isEmpty(gameFilter) && !Ember.isEmpty(item.get('unit'))) {
//       return false;
//     }
    console.debug("WTF", item, " - ", item.get("unit"), " - ", Ember.isEmpty(item.get('unit')));

//     if (Ember.isEmpty(searchFilter) && Ember.isEmpty(unitFilter)) {
//       return true;
//     }

//     if (!Ember.isEmpty(searchFilter)) {
//       var regex = new RegExp(searchFilter, 'i');
//       var handle = get(member, 'handle') ? get(member, 'handle') : get(member, 'name');
//       res = get(member, 'name').match(regex) || handle.match(regex);

//       if (Ember.isEmpty(res)) {
//         return false;
//       }
//     }

    if (!Ember.isEmpty(gameFilter)) {
      var self = this;
      res = item.get('unit').filter(function(unit, index, enumerable){
        return self.hasParent(gameFilter.get("id"), unit.get('unit'));
      });
      if (Ember.isEmpty(res)) {
        return false;
      }
    }

    return res;
  }).property('searchFilter', 'gameFilter'),

  setup: Ember.on('init', function() {
    console.debug(">>>> set root unit for items");
    var self = this;
    get(this, 'store').findRecord('unit', 1).then(function(unit) {
      self.set('games', unit);
    });
  }),

  actions: {
    setGameFilter: function(data) {
      set(this, 'gameFilter', data);
    },

    clearFilter: function() {
      this.set('searchFilter', '');
    },
  }

//   columns: [20, 20, 20, 20, 20],
//   itemHeight: 500,
//   itemWidth: 400,
//   itemSizes: { width: 400, height: 500},
//   itemHeight
//   filteredShips: Ember.computed.filterBy('content', 'member', ),
//   setup: Ember.on('init', function() {
//     this.set('content', this.store.findAll('shipCollection'));
//     this.set('ships', this.store.findAll('ship'));
//   }),
});
