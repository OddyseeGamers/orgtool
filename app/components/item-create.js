import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;

export default Ember.Component.extend({
  classNames: ['item-create'],
  store: Ember.inject.service(),
  loader: Ember.inject.service(),
  session: Ember.inject.service('session'),

  items: null,
  showDialog: false,
  itemTypeFilter: [],


  setup: Ember.on('init', function() {
    var itf = get(this, "itemTypeFilter");
    var item = get(this, "item");
    
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
        console.debug("error", err);
    }
    return false;
  },

  setTypeAndFilter: function(type) {
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

      res = items.filter(function(it, index, enumerable){
          return type.get("id") == it.get("type").get("id");
      });
      if (!Ember.isEmpty(res.get("firstObject").get("parent")) && !Ember.isEmpty(res.get("firstObject").get("parent").get("type"))) {
        parentType = res.get("firstObject").get("parent").get("type");
        res = items.filter(function(it, index, enumerable) {
//               console.debug("wtf", it.get("id") ,"|", it.get("name"), parentType, "|", it.get("type"));
            return it.get("id") && it.get("type") && it.get("type").get("id") == parentType.get("id");
        });

        if (!Ember.isEmpty(res.get("firstObject").get("parent")) && !Ember.isEmpty(res.get("firstObject").get("parent").get("type"))) {
          var ptype = res.get("firstObject").get("parent").get("type");
//             console.debug("--- ptype", ptype.get("id"), "|", ptype.get("name")); //   parentType.get("parent").get("items"));

          self.get("store").findAll("item").then(function(its) {
            var r = its.filter(function(i, index, enumerable) {
//                 console.debug("wtf2", i.get("id") ,"|", i.get("name"), " -pid", ptype.get("id"), "|", i.get("type").get("id"));
              return i.get("id") && i.get("type") && i.get("type").get("id") == ptype.get("id");
            });
            set(self, "itemParentRoot", r);
//               console.debug("--- found", r.get("length")); //   parentType.get("parent").get("items"));
          });
        }
      }

      set(self, "parents", res);
      set(self, "parentType", parentType);
    });
  },


  actions: {
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
//         console.debug("save item", item.get("name"), item.get("parent").get("name"), "-", item.get("type").get("name"), "-", item.get("member").get("id"));
        var self = this;
        var mem = get(item, 'member');
        var memid = get(mem, 'id');
//         self.set('showDialog', false);
        item.save().then(function(nitem) {
//           self.get('eventManager').trigger('success', 'ship added to member: ' + memid);
//           console.debug(">>>>", nitem.get("id"), "-", mem.get("items")); //.get("length"));
          mem.get("items").pushObject(nitem);
          self.set('item', null);
          self.set('showDialog', false);
          get(self, "session").log("item", "item " + nitem.get("name") + " saved");
//           console.debug(">>>> SAVED!", nitem.get("id"), "-", mem.get("items")); //.get("length"));
        }).catch(function(err) {
//           self.get('eventManager').trigger('failure', 'counld not add ship to member: ' + memid);
          get(self, "session").log("error", "could not save item " + item.get("name"));
          console.debug("error saving", err);
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
            console.debug("error melting", err);
          });
        }

        if (!Ember.isEmpty(item.get("member")) && !Ember.isEmpty(item.get("member").get("items"))) {
//         console.debug(">>> RELOAD  MEMBER");
//           item.get("member").get("items").reload();
        } 

      }
      this.set('showDialog', false);
      this.set('item', null);
    },
  }
});
