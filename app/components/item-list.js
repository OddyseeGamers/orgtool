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
  typeFilter: null,
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
//     this.get('eventManager').on('deleteItem', this.deleteItem.bind(this));
//     this.get('eventManager').on('editItem', this.editItem.bind(this));

//     this.get('eventManager').on('closeConfirm', this.closeConfirm.bind(this));
//     this.get('eventManager').on('okConfirm', this.okConfirm.bind(this));

//     Ember.Logger.debug("itemTypeFilter", get(this, "itemTypeFilter"));
    var self = this;

    if (!Ember.isEmpty(get(this, "member"))) {
      set(this, "items", get(this, "member").get("items"));
    } else {
      get(this, 'store').findAll('item').then(function(items) {
        self.set('items', items);
      });
    }
    get(this, 'store').findAll('category').then(function(categories) {
      self.set('categories', categories);
    });
    get(this, 'store').findAll('template').then(function(templates) {
      self.set('templates', templates);
    });

    get(this, 'store').findAll('item').then(function(types) {
      self.set('types', types);
    });

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
    var typeFilter = this.get('typeFilter');
    console.log("filter:", typeFilter)
     if (typeFilter == "tpls") {
      // templates
      return get(this, 'store').findAll('template');
    } else if (typeFilter == "items") {
      // items
      if (!Ember.isEmpty(get(this, "member"))) {
        return get(this, "member").get("items");
      } else {
        return get(this, 'store').findAll('item');
      }
    } else {
      // categories
      return get(this, 'store').findAll('category');
    }
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
//           Ember.Logger.debug("has mem", get(get(msg, "item"), "member"));

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
      if (!Ember.isEmpty(get(this, "member"))) {
        item.set('member', get(this, "member"));
        get(this, "session").log("item", "added item to member " + get(this, "member").get("name"));
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
