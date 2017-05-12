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
      var player = this.store.createRecord('player');
      Ember.Logger.debug(">>>> add player", player);
      this.set('model', player);
//
//       this.set('showDialog', true);
    },*/

    saveMember: function(player) {
      this.get('eventManager').trigger('saveMember', player);

//         Ember.Logger.debug("save player", player.get('id'));

      player.save().then(function(mem) {
        Ember.Logger.debug("save ok", mem);
      }).catch(function(err) {
        Ember.Logger.debug("save not ok", err);
      });
    },

    deleteMember: function(player) {
//       this.get('eventManager').trigger('deleteMember', player);
//
      Ember.Logger.debug("delete user now", player);
      set(this, "msg", { "type": "delete", "item": player, "title": "Delete Member!", "content": "Do you really want to delete player " + player.get("id") + " | " + player.get("name") + "?" });
      set(this, "showConfirmDialog", true);

    },

    onConfirmed: function(msg) {
      Ember.Logger.debug("on confirm del mem", msg, " - ", get(msg, "item"));
      if (!msg || !msg.item) {
        return;
      }
      Ember.Logger.debug("delete user");
//       player.deleteRecord('player'); //this.store.createRecord('player');
      var self = this;
      msg.item.destroyRecord().then(function(done) {
        set(self, "showConfirmDialog", false);
        self.transitionToRoute('players');
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
      */
    },

//////////////////////////////////////////

    addHandle: function(player) {
      var handle = this.store.createRecord('handle');
      handle.set('player', player);
      Ember.Logger.debug("set currhandle", handle);
      set(this, 'currHandle', handle);
      set(this, "showHandleDialog", true);
    },

    editHandle: function(handle) {
//       var handle = this.store.createRecord('handle');
//       handle.set('player', player);
      Ember.Logger.debug("set currhandle", handle);
      set(this, 'currHandle', handle);
      set(this, "showHandleDialog", true);
    },


//////////////////////////////////////////
//
    addShip: function(player) {
      var ship = this.store.createRecord('ship');
      ship.set('player', player);
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
      this.transitionToRoute('players');
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
        var memid = get(ship, 'player.id');
        self.get('eventManager').trigger('log', 'adding ship to player: ' + memid);
        self.get('eventManager').trigger('setLoading', true);
        self.set('showDialog', false);
        ship.save().then(function(nship) {
          self.get('eventManager').trigger('success', 'ship added to player: ' + memid);
          self.set('currShip', null);
          self.set('showDialog', false);
        }).catch(function(err) {
          self.get('eventManager').trigger('failure', 'counld not add ship to player: ' + memid);
          Ember.Logger.debug("error saving", err);
          self.set('showDialog', true);
        });
      }
    },
    meldShip: function(ship) {
      if (ship) {
        var self = this;
        var memid = get(ship, 'player.id');
        self.get('eventManager').trigger('log', 'melting ship of player: ' + memid);
        self.get('eventManager').trigger('setLoading', true);
        ship.destroyRecord().then(function(nship) {
          self.get('eventManager').trigger('success', 'ship melted of player: ' + memid);
        }).catch(function(err) {
          self.get('eventManager').trigger('failure', 'counld not melt ship of player: ' + memid);
          Ember.Logger.debug("error melting", err);
        });
      }
    },
  }


});
