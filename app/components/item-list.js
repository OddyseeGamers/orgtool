import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;
var debug = Ember.Logger.log;

export default Ember.Component.extend({
  classNames: ['item-filtered-list'],
  sortProperties: ['numericID'],
  details: false,
  showEdit: false,
  session: Ember.inject.service('session'),
  store: Ember.inject.service('store'),
//   eventManager: Ember.inject.service('events'),
  gameFilter: null,
  typeFilter: "cats",
  columns: [25, 25, 25, 25],
  itemHeight: 400,
  showFilter: true,
  categories: [],
  templates: [],
  items: [],
  showConfirmDialog: false,
  showItemDialog: false,
  showItemTypeDialog: false,

  itemTypeFilter: [],
  adminMode: false,

  setup: Ember.on('didInsertElement', function() {
    if (!Ember.isEmpty(get(this, "player"))) {
      debug(">>> list",get(this, "player") );
//       set(this, "items", get(this, "player").get("items"));
    } 

//     this.get('eventManager').on('deleteItem', this.deleteItem.bind(this));
//     this.get('eventManager').on('editItem', this.editItem.bind(this));

//     this.get('eventManager').on('closeConfirm', this.closeConfirm.bind(this));
//     this.get('eventManager').on('okConfirm', this.okConfirm.bind(this));


/*
    if (!Ember.isEmpty(get(this, "player"))) {
      set(this, "items", get(this, "player").get("items"));
    } 

    var self = this;
//     get(this, 'store').findAll('itemType').then(function(types) {
//       self.set('types', types);
//     });
    var itf = get(this, "itemTypeFilter");
    get(this, 'store').findAll('itemType').then(function(types) {
      var res;
      if (Ember.isArray(itf)) {
        if (itf.length > 0) {
          res = types.filter(function(record) {
            return itf.indexOf(record.get('id')) >= 0;
          });
        } else {
          res = types;
        }
      } else {
        res = types.filter(function(record){
          return record.get('permissions') == 1;
        });
      }

      self.set('types', res);
    });
*/

    Ember.Logger.log("itemTypeFilter", get(this, "itemTypeFilter"), "|adminmode:", get(this, "adminMode"));
    var self = this;


    debug("has player", get(this, "player"));
    if (!Ember.isEmpty(get(this, "player"))) {
      set(this, "items", get(this, "player").get("items"));
    } else {
      get(this, 'store').findAll('item').then(function(items) {
        self.set('items', items);
      });
    }
  
//     if (get(this, "adminMode") {
//       get(this, 'store').findAll('category').then(function(categories) {
//         self.set('categories', categories);
//       });
//       get(this, 'store').findAll('template').then(function(templates) {
//         self.set('templates', templates);
//       });

//       get(this, 'store').findAll('item').then(function(types) {
//         self.set('types', types);
//       });
//     } else if (get(this, "player")

//     get(this, 'store').findAll('itemType').then(function(types) {
//       self.set('types', types);
//     });
  }),

  hasParent: function(id, unit) {
    try {
      return unit.get("id") == id || unit.get('parent') && this.hasParent(id, unit.get('parent'));
    } catch(err) {
        Ember.Logger.debug("error", err);
    }
    return false;
  },

  filteredContent: Ember.computed('items', function() {
    var gameFilter = this.get('gameFilter');
    var typeFilter = this.get('typeFilter');
    var res = []

    debug("set filter ", typeFilter);

    if (get(this, "player")) {
      return get(this, "player").get("items");
    } else {
      if (typeFilter == "cats") {
        return get(this, 'store').findAll('category');
      } else if (typeFilter == "tpls") {
        return get(this, 'store').findAll('template');
      } else if (typeFilter == "items") {
        return get(this, 'store').findAll('item');
      }
    }
    return [];


//     if (!Ember.isEmpty(typeFilter)) {
//       Ember.Logger.debug("item name", item.get("name"), "-", item.get("type").get("id"), " --- ", typeFilter.get("id"));
//       var par = item.get("parent");
//       if (par && par.get("type")) {
//       Ember.Logger.debug("item name", item.get("name"), "-", par.get("type").get("id"), " --- ", typeFilter.get("id"));
//       }
//       return item.get("type").get("id") == typeFilter.get("id");

//     }

//     return get(this, "player").get("items");
//     return get(this, "items");


  /*
    var typeFilter = this.get('typeFilter');
    console.log("filter:", typeFilter)
     if (typeFilter == "tpls") {
      // templates
      return get(this, 'store').findAll('template');
    } else if (typeFilter == "items") {
      // items
      if (!Ember.isEmpty(get(this, "player"))) {
        return get(this, "player").get("items");
      } else {
        return get(this, 'store').findAll('item');
      }
    } else {
      // categories
      return get(this, 'store').findAll('category');
    }
    */
  }).property('typeFilter', "items", "currItem"),

  sortedContent: Ember.computed.sort('filteredContent', 'sortProperties').property('filteredContent'),

  /*
  deleteItem: function(item) {
    Ember.Logger.debug("### delete clicked");

//     Ember.Logger.debug("delete ITem here", item.get("id"));
//     set(this, "msg", { "type": "delete", "item": item, "title": "Delete Item?", "content": "Do you really wnat to delete" });
//     Ember.Logger.debug("delete ITem here", get(this, "msg"));
//     set(this, "showConfirmDialog", true);
  },

  editItem: function(item) {
//     Ember.Logger.debug("edit ITem here", item.get("id"));
    set(this, "currItem", item);
    set(this, "showItemDialog", true);
  },

  closeConfirm: function() {
    Ember.Logger.debug("### close clicked");
//  
//     set(this, "currItem", null);
//     this.set("showConfirmDialog", false);
//     set(this, "showItemDialog", false);
  },

  okConfirm: function(msg) {
    Ember.Logger.debug("### ok clicked");

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
      set(this, "msg", { "type": "delete", "item": item, "title": "Delete Item!", "content": "Do you really want to delete the item " + item.get("name") + "?" });
      set(this, "showConfirmDialog", true);
    },

    showConfirmType: function(itemType) {
      set(this, "msg", { "type": "delete", "item": itemType, "title": "Delete Item Type!", "content": "Do you really want to delete the item type " + itemType.get("name") + "?" });
      set(this, "showConfirmDialog", true);
    },

    onConfirmed: function(msg) {
      Ember.Logger.debug("on confirm");
      var element = get(msg, "item");
      var typename = element.get('constructor.modelName');
      Ember.Logger.debug("element type", typename);

      if (element && typename) {
        if (get(msg, "type") == "delete") {
          var self = this;
//           Ember.Logger.debug("has mem", get(get(msg, "item"), "player"));

          element.destroyRecord().then(function(nitem) {
            get(self, "session").log(typename, nitem.get("name") + " deleted");

            Ember.Logger.debug("reset filter", (get(self, "typeFilter") === element));
            if (get(self, "typeFilter") === element) {
              set(self, "typeFilter", null);
            }
          }).catch(function(err) {
            get(self, "session").log("error", "could not delete " + typename + " " + element.get("name"));
            Ember.Logger.debug("error deleting", err);
          }).finally(function() {
            set(self, "currItem", null);
            set(self, "currItemType", null);
            set(self, "showConfirmDialog", false);
            set(self, "showItemDialog", false);
            set(self, "showItemTypeDialog", false);
          });
        }
      } else {
        set(this, "currItem", null);
        set(this, "currItemType", null);
        set(this, "showConfirmDialog", false);
        set(this, "showItemDialog", false);
        set(this, "showItemTypeDialog", false);
      }
    },

    showEdit: function(item) {
      set(this, "currItem", item);
      set(this, "showItemDialog", true);
    },

    addItem: function() {
      debug("ADD ITEM");
      var item = get(this, "store").createRecord('item');
      get(this, "session").log("item", "new item created");
      if (!Ember.isEmpty(get(this, "player"))) {
        item.set('player', get(this, "player"));
        get(this, "session").log("item", "added item to player " + get(this, "player").get("name"));
      }
      this.set('currItem', item);
      this.set('showItemDialog', true);
    },

    addItemType: function() {
      var itemType = get(this, "store").createRecord('itemType');
      get(this, "session").log("item", "new itemType created");
      this.set('currItemType', itemType);
      this.set('showItemTypeDialog', true);
    },

    editItemType: function(itemType) {
//       var itemType = get(this, "store").createRecord('itemType');
//       get(this, "session").log("item", "new itemType created");
      this.set('currItemType', itemType);
      this.set('showItemTypeDialog', true);
    },
  }

});
