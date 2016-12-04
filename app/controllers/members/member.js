import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;

export default Ember.Controller.extend({
  store: Ember.inject.service(),
  eventManager: Ember.inject.service('events'),
  session: Ember.inject.service('session'),
  loader: Ember.inject.service('loader'),
  showDialog: false,

  showItemDialog: false,
  itemTypeFilter: ["3"],

  sortProperties: ['name:asc'],
  sortedShipModels: Ember.computed.sort('shipModels', 'sortProperties'),
  member: null,
  columns: [25, 25, 25, 25],
  itemHeight: 150,



//   changed: function() {
//     console.debug("dialog....");
//   }.observes('showDialog'),

//   changed: function() {
//     console.debug("ITEM dialog....");
//   }.observes('showItemDialog'),

  actions: {





    submit: function() {
//       var unit = get(this, 'unit');
      var self = this;

      self.set('showDialog', false);
    },

    /*
    addMember: function() {
      var member = this.store.createRecord('member');
      console.debug(">>>> add member", member);
      this.set('model', member);
//
//       this.set('showDialog', true);
    },*/

    saveMember: function(member) {
      this.get('eventManager').trigger('saveMember', member);

//         console.debug("save member", member.get('id'));

//       member.save().then(function(mem) {
//         console.debug("save ok", mem);
//       }).catch(function(err) {
//         console.debug("save not ok", err);
//       });
    },

    deleteMember: function(member) {
      this.get('eventManager').trigger('deleteMember', member);
    },

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
//       console.debug("the other close...");
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
          console.debug("error saving", err);
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
          console.debug("error melting", err);
        });
      }
    },
  }


});
