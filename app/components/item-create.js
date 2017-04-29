import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;
var debug = Ember.Logger.log;

export default Ember.Component.extend({
  classNames: ['item-create'],
  store: Ember.inject.service(),
  session: Ember.inject.service('session'),

  items: null,
  showDialog: false,
  itemTypeFilter: [],
  otypeid: null,

  hasType: Ember.computed.notEmpty("item.type.id"),
  hasParentSet: Ember.computed.notEmpty("item.parent.id"),
  requiredFields: Ember.computed.and("hasType", "hasParentSet"),

  parentChanged: function() {
    return get(this, "otypeid") != get(this, "item.parent.id");
  }.property('item.parent.id'),

  cannotSave: function() {
    return !(get(this, "requiredFields") && (get(this, 'item.hasDirtyAttributes') || get(this, 'parentChanged')));
  }.property('requiredFields', 'item.hasDirtyAttributes', 'parentChanged'),

  setup: Ember.on('init', function() {
    var itf = get(this, "itemTypeFilter");
    var item = get(this, "item");
    if (get(this, "item.parent.id")) {
      set(this, "otypeid", get(this, "item.parent.id"));
    }

    if (Ember.isEmpty(item)) {
      return;
    }

    if (item.get("type")) {
      this.setTypeAndFilter(item.get("type"));
    }
    var self = this;
    /*
      get(this, 'store').findAll('itemType').then(function(types) {
      self.set('types', types);
      });
    */

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


    /*
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
      });


      var res = types.filter(function(record) {
      return itf.indexOf(record.get('id')) >= 0;
      });
      self.set('types', res);

      if (get(res, "length") == 1) {
      set(self, "showType", false);
      self.setTypeAndFilter(res.get("firstObject"));
      }
    */
    /*
      if (get(self, "session").isUser) {
      var res = types.filter(function(record) {
      return itf.indexOf(record.get('id')) >= 0;
      });
      self.set('types', res);

      if (get(res, "length") == 1) {
      set(self, "showType", false);
      self.setTypeAndFilter(res.get("firstObject"));
      }
      } else { // if () {
      var res = types.filter(function(record){
      return record.get('permissions') == 1;
      });
      self.set('types', res);
      }
    */


    /*
      if (get(self, "session").isAdmin) {
      self.set('types', types);
      } else if (get(self, "session").isUser) {
      var res = types.filter(function(record){
      return record.get('permissions') == 1;
      });
      self.set('types', res);
      }
    */
  }),

  hasParent: function(id, item) {
    try {
      return item.get("id") == id || item.get('parent') && this.hasParent(id, item.get('parent'));
    } catch(err) {
      Ember.Logger.debug("error", err);
    }
    return false;
  },

  setTypeAndFilter: function(type) {
    console.log(type.get("parent"))
    var item = get(this, "item");
    if (item.get("type") && item.get("type").get("id") != type.get("id")) {
      set(item, "type", type);
      if (get(item, "isNew")) {
        set(item, "parent", null);
      }

    }
    var self = this;

    get(this, "store").findAll("item").then(function(items) {
      var res;
      var parentType;
      set(self, "itemParentRoot", null);

      parentType = type.get("parent");
      res = items.filter(function(it, index, enumerable) {
        //               Ember.Logger.debug("wtf", it.get("id") ,"|", it.get("name"), parentType, "|", it.get("type"));
        return it.get("id") && it.get("type") && it.get("type").get("id") == parentType;
      });

      if (!Ember.isEmpty(res.get("firstObject").get("parent")) && !Ember.isEmpty(res.get("firstObject").get("parent").get("type"))) {
        var ptype = res.get("firstObject").get("parent").get("type");
        //             Ember.Logger.debug("--- ptype", ptype.get("id"), "|", ptype.get("name")); //   parentType.get("parent").get("items"));

        self.get("store").findAll("item").then(function(its) {
          var r = its.filter(function(i, index, enumerable) {
            //                 Ember.Logger.debug("wtf2", i.get("id") ,"|", i.get("name"), " -pid", ptype.get("id"), "|", i.get("type").get("id"));
            return i.get("id") && i.get("type") && i.get("type").get("id") == ptype.get("id");
          });
          set(self, "itemParentRoot", r);
          //               Ember.Logger.debug("--- found", r.get("length")); //   parentType.get("parent").get("items"));
        });
      }


      set(self, "parents", res);
      set(self, "parentType", parentType);
    });
  },


  actions: {
    changeOwner: function(owner) {
      debug(">>>> new ID: ", owner.id);
      var item = get(this, "item");
      set(item, "member", owner);
      item.save().then(function(done) {
        debug("saved....", get(done, "id"));
      }).catch(function(err) {
        debug("item-create save failed, err", err);
        item.rollbackAttributes();
      });
      //       this.setTypeAndFilter(type);
    },

    setType: function(type) {
      this.setTypeAndFilter(type);
    },

    setParent: function(par) {
      var item = get(this, "item");
      set(item, "parent", par);
    },

    saveItem: function() {
      var item = get(this, "item");
      if (item) {
        //         Ember.Logger.debug("save item", item.get("name"), item.get("parent").get("name"), "-", item.get("type").get("name"), "-", item.get("member").get("id"));
        var self = this;
        var mem = get(item, 'member');
        var memid = get(mem, 'id');
        //         self.set('showDialog', false);
        item.save().then(function(nitem) {
          //           self.get('eventManager').trigger('success', 'ship added to member: ' + memid);
          //           Ember.Logger.debug(">>>>", nitem.get("id"), "-", mem.get("items")); //.get("length"));
          mem.get("items").pushObject(nitem);
          self.set('item', null);
          self.set('showDialog', false);
          get(self, "session").log("item", "item " + nitem.get("name") + " saved");
          //           Ember.Logger.debug(">>>> SAVED!", nitem.get("id"), "-", mem.get("items")); //.get("length"));
        }).catch(function(err) {
          //           self.get('eventManager').trigger('failure', 'counld not add ship to member: ' + memid);
          get(self, "session").log("error", "could not save item " + item.get("name"));
          Ember.Logger.debug("error saving", err);
          self.set('showDialog', true);
        });
      }
    },
    close: function() {
      var item = get(this, 'item');
      if (!Ember.isEmpty(item)) {
        if (!Ember.isEmpty(item.get("id"))) {
          item.reload();
        } else if (item.get("isNew")) {
          var self = this;
          item.destroyRecord().then(function(nitem) {
            get(self, "session").log("item", "item " + nitem.get("name") + " deleted");
          }).catch(function(err) {
            get(self, "session").log("error", "could not save item " + nitem.get("name"));
            Ember.Logger.debug("error melting", err);
          });
        }

        if (!Ember.isEmpty(item.get("member")) && !Ember.isEmpty(item.get("member").get("items"))) {
          //         Ember.Logger.debug(">>> RELOAD  MEMBER");
          //           item.get("member").get("items").reload();
        }

      }
      this.set('showDialog', false);
      this.set('item', null);
    },
  }
});
