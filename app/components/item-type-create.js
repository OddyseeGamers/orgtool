import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;

export default Ember.Component.extend({
  classNames: ['item-type-create'],
  store: Ember.inject.service(),
  session: Ember.inject.service('session'),

  showDialog: false,

  setup: Ember.on('init', function() {
  }),



  actions: {
    deleteItemType: function(itemType) {
      this.get('onConfirm')(itemType);
    },


    saveItemType: function(itemType) {
//       var itemType = get(this, "itemType");
      var self = this;
      if (itemType) {
//         console.debug("save item", item.get("name"), item.get("parent").get("name"), "-", item.get("type").get("name"), "-", item.get("member").get("id"));
        itemType.save().then(function(nitemType) {
//           self.get('eventManager').trigger('success', 'ship added to member: ' + memid);
//           console.debug(">>>>", nitem.get("id"), "-", mem.get("items")); //.get("length"));
          self.set('itemType', null);
          self.set('showDialog', false);
          get(self, "session").log("itemType", "itemType " + nitemType.get("name") + " saved");
//           console.debug(">>>> SAVED!", nitem.get("id"), "-", mem.get("items")); //.get("length"));
        }).catch(function(err) {
//           self.get('eventManager').trigger('failure', 'counld not add ship to member: ' + memid);
          get(self, "session").log("error", "could not save itemType " + itemType.get("name"));
          console.debug("error saving", err);
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
            console.debug("error deleting itemType", err);
          });
        }
      }
      this.set('showDialog', false);
      this.set('itemType', null);
    },
  }
  
});
