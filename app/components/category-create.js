import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;
var debug = Ember.Logger.log;

export default Ember.Component.extend({
  classNames: ['category-create'],
  store: Ember.inject.service(),
  session: Ember.inject.service('session'),

  showDialog: false,

//   hasType: Ember.computed.notEmpty("itemType.name"),
//   hasTypename: Ember.computed.notEmpty("itemType.typeName"),
//   requiredFields: Ember.computed.and("hasType", "hasTypename"),
  requiredFields: true,

  setup: Ember.on('init', function() {
//     var self = this;
//     get(this, 'store').findAll('itemType').then(function(types) {
//       set(self, "types", types);
//     });
  }),

  actions: {
//     setParent: function(parent) {
//         set(this, "itemType.parent", parent);
//     },

    deleteCategory: function(category) {
      this.get('onConfirm')(itemType);
    },

    saveCategory: function(category) {
      debug("save category")
      var self = this;
      if (category) {
        category.save().then(function(ncategory) {
          self.set('category', null);
          self.set('showDialog', false);
          get(self, "session").log("category", "category " + ncategory.get("name") + " saved");
        }).catch(function(err) {
          get(self, "session").log("error", "could not save category " + category.get("name"));
          Ember.Logger.debug("error saving", err);
          self.set('showDialog', true);
        });
      }
    },

    close: function() {
      var category = get(this, 'category');
      var self = this;
      if (!Ember.isEmpty(category)) {
        if (!Ember.isEmpty(category.get("id"))) {
          category.reload();
        } else if (category.get("isNew")) {
          var self = this;
          category.destroyRecord().then(function(category) {
            get(self, "session").log("category", "category " + category.get("name") + " deleted");
          }).catch(function(err) {
            get(self, "session").log("error", "could not save category " + category.get("name"));
            Ember.Logger.debug("error deleting category", err);
          });
        }
      }
      this.set('showDialog', false);
      this.set('category', null);
    },
  }
});
