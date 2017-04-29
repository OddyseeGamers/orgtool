import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;
var debug = Ember.Logger.log;

export default Ember.Component.extend({
  classNames: ['item-type-create'],
  store: Ember.inject.service(),
  session: Ember.inject.service('session'),

  showDialog: false,

  hasType: Ember.computed.notEmpty("itemType.name"),
  hasTypename: Ember.computed.notEmpty("itemType.typeName"),
  requiredFields: Ember.computed.and("hasType", "hasTypename"),

  setup: Ember.on('init', function() {
    var self = this;
    get(this, 'store').findAll('itemType').then(function(types) {
      set(self, "types", types);
    });
  }),

  actions: {
    setParent: function(parent) {
        set(this, "itemType.parent", parent);
    },

    deleteItemType: function(itemType) {
      this.get('onConfirm')(itemType);
    },

    saveItemType: function(itemType) {
      var self = this;
      if (itemType) {
        itemType.save().then(function(nitemType) {
          self.set('itemType', null);
          self.set('showDialog', false);
          get(self, "session").log("itemType", "itemType " + nitemType.get("name") + " saved");
        }).catch(function(err) {
          get(self, "session").log("error", "could not save itemType " + itemType.get("name"));
          Ember.Logger.debug("error saving", err);
          self.set('showDialog', true);
        });
      }
    },

    close: function() {
      var itemType = get(this, 'itemType');
      var self = this;
      if (!Ember.isEmpty(itemType)) {
        if (!Ember.isEmpty(itemType.get("id"))) {
          itemType.reload();
        } else if (itemType.get("isNew")) {
          var self = this;
          itemType.destroyRecord().then(function(nitemType) {
            get(self, "session").log("itemType", "itemType " + nitemType.get("name") + " deleted");
          }).catch(function(err) {
            get(self, "session").log("error", "could not save itemType " + itemType.get("name"));
            Ember.Logger.debug("error deleting itemType", err);
          });
        }
      }
      this.set('showDialog', false);
      this.set('itemType', null);
    },
  }
});
