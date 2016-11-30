import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;

export default Ember.Component.extend({
  classNames: ['item-filtered-list'],
  sortProperties: ['numericID'],
  details: false,
  showEdit: false,
  session: Ember.inject.service('session'),
  store: Ember.inject.service('store'),
//   eventManager: Ember.inject.service('events'),
  loader: Ember.inject.service('loader'),
  gameFilter: null,
  typeFilter: null,
  itemTypeFilter: null,
  columns: [25, 25, 25, 25],
  itemHeight: 400,
  showFilter: true,
  items: [],
  showConfirmDialog: false,
  showItemDialog: false,
  itemTypeFilter: [],
  adminMode: false,

  setup: Ember.on('didInsertElement', function() {
//     this.get('eventManager').on('deleteItem', this.deleteItem.bind(this));
//     this.get('eventManager').on('editItem', this.editItem.bind(this));

//     this.get('eventManager').on('closeConfirm', this.closeConfirm.bind(this));
//     this.get('eventManager').on('okConfirm', this.okConfirm.bind(this));

    console.debug("itemTypeFilter", get(this, "itemTypeFilter"));
    if (!Ember.isEmpty(get(this, "member"))) {
      set(this, "items", get(this, "member").get("items"));
    } 

    var self = this;
//     get(this, 'store').findAll('itemType').then(function(types) {
//       self.set('types', types);
//     });
    var itf = get(this, "itemTypeFilter");
    get(this, 'store').findAll('itemType').then(function(types) {
      var res;
      if (Ember.isArray(itf) && itf.length > 0) {
        res = types.filter(function(record) {
          return itf.indexOf(record.get('id')) >= 0;
        });
      } else {
        res = types;
      }
      self.set('types', res);

//         if (get(res, "length") == 1) {
//           set(self, "showType", false);
//           self.setTypeAndFilter(res.get("firstObject"));
//         }
    });



  }),

  hasParent: function(id, unit) {
    try {
      return unit.get("id") == id || unit.get('parent') && this.hasParent(id, unit.get('parent'));
    } catch(err) {
        console.debug("error", err);
    }
    return false;
  },

  filteredContent: Ember.computed.filter('items', function(item, index, array) {
    var gameFilter = this.get('gameFilter');
    var typeFilter = this.get('typeFilter');
    var res = []

    if (!Ember.isEmpty(typeFilter)) {
//       console.debug("item name", item.get("name"), "-", item.get("type").get("id"), " --- ", typeFilter.get("id"));
//       var par = item.get("parent");
//       if (par && par.get("type")) {
//       console.debug("item name", item.get("name"), "-", par.get("type").get("id"), " --- ", typeFilter.get("id"));
//       }
      return item.get("type").get("id") == typeFilter.get("id");
    }

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
//     console.debug("WTF", item, " - ", item.get("unit"), " - ", Ember.isEmpty(item.get('unit')));

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
  }).property('typeFilter', 'gameFilter', "items", "currItem"),

  sortedContent: Ember.computed.sort('filteredContent', 'sortProperties').property('filteredContent'),

  /*
  deleteItem: function(item) {
    console.debug("### delete clicked");

//     console.debug("delete ITem here", item.get("id"));
//     set(this, "msg", { "type": "delete", "item": item, "title": "Delete Item?", "content": "Do you really wnat to delete" });
//     console.debug("delete ITem here", get(this, "msg"));
//     set(this, "showConfirmDialog", true);
  },

  editItem: function(item) {
//     console.debug("edit ITem here", item.get("id"));
    set(this, "currItem", item);
    set(this, "showItemDialog", true);
  },

  closeConfirm: function() {
    console.debug("### close clicked");
//  
//     set(this, "currItem", null);
//     this.set("showConfirmDialog", false);
//     set(this, "showItemDialog", false);
  },

  okConfirm: function(msg) {
    console.debug("### ok clicked");

  },
    */

  actions: {
    setTypeFilter: function(data) {
      set(this, 'typeFilter', data);
    },

    setGameFilter: function(data) {
      set(this, 'gameFilter', data);
    },

    clearFilter: function() {
      this.set('searchFilter', '');
    },

    showConfirm: function(item) {
      set(this, "msg", { "type": "delete", "item": item, "title": "Delete Item!", "content": "Do you really want to delete?" });
      set(this, "showConfirmDialog", true);
    },

    onConfirmed: function(msg) {
      if (get(msg, "item")) {
        if (get(msg, "type") == "delete") {
          var self = this;

//           console.debug("has mem", get(get(msg, "item"), "member"));

          get(msg, "item").destroyRecord().then(function(nitem) {
            get(self, "session").log("item", "item " + nitem.get("name") + " deleted");
          }).catch(function(err) {
            get(self, "session").log("error", "could not save item " + nitem.get("name"));
            console.debug("error melting", err);
          }).finally(function() {
            set(self, "currItem", null);
            set(self, "showConfirmDialog", false);
            set(self, "showItemDialog", false);
          });
        }
      } else {
        set(this, "currItem", null);
        set(this, "showConfirmDialog", false);
        set(this, "showItemDialog", false);
      }
    },

    showEdit: function(item) {
      set(this, "currItem", item);
      set(this, "showItemDialog", true);
    },

    addItem: function() {
      var item = get(this, "store").createRecord('item');
      get(this, "session").log("item", "new item created");
      if (!Ember.isEmpty(get(this, "member"))) {
        item.set('member', get(this, "member"));
        get(this, "session").log("item", "added item to member " + get(this, "member").get("name"));
      }
      this.set('currItem', item);
      this.set('showItemDialog', true);
    },
  }

});
