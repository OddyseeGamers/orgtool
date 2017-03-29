import Ember from 'ember';
// import Moment from 'moment';

var get = Ember.get;
var set = Ember.set;

export default Ember.Controller.extend({
  store: Ember.inject.service(),
  eventManager: Ember.inject.service('events'),
  session: Ember.inject.service('session'),
  showDialog: false,

  showItemDialog: false,
//   itemTypeFilter: ["3"],

  sortProperties: ['name:asc'],
  sortedShipModels: Ember.computed.sort('shipModels', 'sortProperties'),
  columns: [25, 25, 25, 25],
  itemHeight: 120,

//   tzs: function() {
//     Ember.Logger.debug("wtf", Moment);
//     return Moment.tz.names();
//   }.property("model"),


  actions: {
    submit: function() {
//       var unit = get(this, 'unit');
      var self = this;

      self.set('showDialog', false);
    },

    /*
    addMember: function() {
      var member = this.store.createRecord('member');
      Ember.Logger.debug(">>>> add member", member);
      this.set('model', member);
//
//       this.set('showDialog', true);
    },*/

    saveMember: function(member) {
      this.get('eventManager').trigger('saveMember', member);

//         Ember.Logger.debug("save member", member.get('id'));

      member.save().then(function(mem) {
        Ember.Logger.debug("save ok", mem);
      }).catch(function(err) {
        Ember.Logger.debug("save not ok", err);
      });
    },

    deleteMember: function(member) {
//       this.get('eventManager').trigger('deleteMember', member);
//
      Ember.Logger.debug("delete user now", member);
      set(this, "msg", { "type": "delete", "item": member, "title": "Delete Member!", "content": "Do you really want to delete member " + member.get("id") + " | " + member.get("name") + "?" });
      set(this, "showConfirmDialog", true);

    },

    onConfirmed: function(msg) {
      Ember.Logger.debug("on confirm del mem", msg, " - ", get(msg, "item"));
      if (!msg || !msg.item) {
        return;
      }
      Ember.Logger.debug("delete user");
//       member.deleteRecord('member'); //this.store.createRecord('member');
      var self = this;
      msg.item.destroyRecord().then(function(done) {
        set(self, "showConfirmDialog", false);
        self.transitionToRoute('members');
      }).catch(function(err) {
        Ember.Logger.debug("delete  user", err);
      });
      /*
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
      */
    },

//////////////////////////////////////////

    addHandle: function(member) {
      var handle = this.store.createRecord('handle');
      handle.set('member', member);
      Ember.Logger.debug("set currhandle", handle);
      set(this, 'currHandle', handle);
      set(this, "showHandleDialog", true);
    },

    editHandle: function(handle) {
//       var handle = this.store.createRecord('handle');
//       handle.set('member', member);
      Ember.Logger.debug("set currhandle", handle);
      set(this, 'currHandle', handle);
      set(this, "showHandleDialog", true);
    },


//////////////////////////////////////////
//
    addShip: function(member) {
      var ship = this.store.createRecord('ship');
      ship.set('member', member);
      this.set('currShip', ship);
      this.set('showDialog', true);
    },
    editShip: function(ship) {
      if (ship) {
        var self = this;
        this.set('currShip', ship);
        this.set('showDialog', true);
      }
    },
    setModel: function(shipModel) {
      var ship = get(this, 'currShip');
      ship.set('model', shipModel);
    },
    close: function() {
//       Ember.Logger.debug("the other close...");
      this.set('showDialog', false);
      this.transitionToRoute('members');
    },
    /*
    close: function() {
      var ship = get(this, 'currShip');
      if (ship) {
        ship.deleteRecord();
        this.set('currShip', null);
      }
      this.set('showDialog', false);
    },
    */
    saveShip: function() {
      var ship = get(this, 'currShip');
      if (ship) {
        var self = this;
        var memid = get(ship, 'member.id');
        self.get('eventManager').trigger('log', 'adding ship to member: ' + memid);
        self.get('eventManager').trigger('setLoading', true);
        self.set('showDialog', false);
        ship.save().then(function(nship) {
          self.get('eventManager').trigger('success', 'ship added to member: ' + memid);
          self.set('currShip', null);
          self.set('showDialog', false);
        }).catch(function(err) {
          self.get('eventManager').trigger('failure', 'counld not add ship to member: ' + memid);
          Ember.Logger.debug("error saving", err);
          self.set('showDialog', true);
        });
      }
    },
    meldShip: function(ship) {
      if (ship) {
        var self = this;
        var memid = get(ship, 'member.id');
        self.get('eventManager').trigger('log', 'melting ship of member: ' + memid);
        self.get('eventManager').trigger('setLoading', true);
        ship.destroyRecord().then(function(nship) {
          self.get('eventManager').trigger('success', 'ship melted of member: ' + memid);
        }).catch(function(err) {
          self.get('eventManager').trigger('failure', 'counld not melt ship of member: ' + memid);
          Ember.Logger.debug("error melting", err);
        });
      }
    },
  }


});
