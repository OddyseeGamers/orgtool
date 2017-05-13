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
//     if (!Ember.isEmpty(get(this, "player"))) {
//       debug(">>> list",get(this, "player") );
//       set(this, "items", get(this, "player").get("items"));
//     } 

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

//     Ember.Logger.log("itemTypeFilter", get(this, "itemTypeFilter"), "|adminmode:", get(this, "adminMode"));
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

  resetAll: function() {
    set(this, "currItem", null);
    set(this, "currCategory", null);
    set(this, "currTemplate", null);

    set(this, "showItemDialog", false);
    set(this, "showCategoryDialog", false);
    set(this, "showTemplateDialog", false);

    set(this, "showConfirmDialog", false);
  },

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
      Ember.Logger.debug("show confirm", get(item, "name"));
//       var element = get(msg, "item");
      var typename = item.get('constructor.modelName');
      debug("element type", typename);

      set(this, "msg", { "type": "delete", "item": item, "title": "Delete " + typename + "!", "content": "Do you really want to delete the " + typename + " " + item.get("name") + "?" });
      set(this, "showConfirmDialog", true);
    },

    onConfirmed: function(msg) {
//       Ember.Logger.debug("on confirm");
      var element = get(msg, "item");
      var typename = element.get('constructor.modelName');
//       debug("element type", typename);

      var self = this;
      if (element && typename) {
        if (get(msg, "type") == "delete") {
//           Ember.Logger.debug("has mem", get(get(msg, "item"), "player"));

          element.destroyRecord().then(function() {
            get(self, "session").log(typename, element.get("name") + " deleted");

//             Ember.Logger.debug("reset filter", (get(self, "typeFilter") === element));
//             if (get(self, "typeFilter") === element) {
//               set(self, "typeFilter", null);
//             }
          }).catch(function(err) {
            get(self, "session").log("error", "could not delete " + typename + " " + element.get("name"));
            Ember.Logger.debug("error deleting", err);
          }).finally(function() {
            self.resetAll();
          });
        }
      } else {
        self.resetAll();
      }
    },

    showEdit: function(item) {
//       Ember.Logger.debug("show edit", get(item, "name"));
//       var element = get(msg, "item");
      var typename = item.get('constructor.modelName');
//       debug("element type", typename);

      if (typename == "category") {
        this.set('currCategory', item);
        this.set('showCategoryDialog', true);
      } else if (typename == "template") {
        this.set('currTemplate', item);
        this.set('showTemplateDialog', true);
      } else if (typename == "item") {
        this.set('currItem', item);
        this.set('showItemDialog', true);
      }
      return;
//       set(this, "currItem", item);
//       set(this, "showItemDialog", true);
    },


    addCategory: function() {
//       debug("ADD CAT");
      var category = get(this, "store").createRecord('category');
      get(this, "session").log("category", "new category created");
      this.set('currCategory', category);
      this.set('showCategoryDialog', true);
    },

    addTemplate: function() {
//       debug("ADD TEMP");
      var template = get(this, "store").createRecord('template');
      get(this, "session").log("template", "new template created");
      this.set('currTemplate', template);
      this.set('showTemplateDialog', true);
    },

    addItem: function() {
//       debug("ADD ITEM");
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
