import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;

export default Ember.Controller.extend({
  store: Ember.inject.service(),
  eventManager: Ember.inject.service('events'),
  classNames: ['strech-tree'],

  setup: Ember.on('init', function() {
    this.get('eventManager').on('assign', this.assign.bind(this));
    this.get('eventManager').on('unassign', this.unassign.bind(this));
    this.get('eventManager').on('addUnit', this.addUnit.bind(this));
    this.get('eventManager').on('deleteUnit', this.deleteUnit.bind(this));
  }),

  assign: function(data) {
    Ember.$(".debug").empty();
    Ember.$(".debug").append('assign member:' + data.id + ' to unit: ' + data.dest + " as " + data.destType);

    var self = this;
    this.store.findRecord('member', data.id).then(function (member) {
      self.store.findRecord('unit', data.dest).then(function (unit) {
        get(unit, 'members').pushObject(member);
        get(member, 'units').pushObject(unit);
      });
    });
  },


  unassign: function(data) {
    Ember.$(".debug").empty();
    Ember.$(".debug").append('unassign member:' + data.id + ' to unit: ' + data.dest + " from " + data.destType);

    var self = this;
    this.store.findRecord('member', data.id).then(function (member) {
      self.store.findRecord('unit', data.dest).then(function (unit) {
        get(unit, 'members').removeObject(member);
        get(member, 'units').removeObject(unit);
      });
    });
  },

  addUnit: function(data) {
    Ember.$(".debug").empty();
    Ember.$(".debug").append('add new unit to ' + data.id);

    var self = this;
    var unit = this.store.createRecord('unit');
      this.store.findRecord('unit', data.id).then(function (punit) {
        get(punit, 'units').pushObject(unit);
        self.get('eventManager').trigger('rerender');
      });
  },

  deleteUnit: function(data) {
    Ember.$(".debug").empty();
    Ember.$(".debug").append('remove unit from ' + data.id + " from " + data.type);

    var self = this;
    this.store.findRecord('unit', data.id).then(function (unit) {
      self.store.deleteRecord(unit); // 'unit', get(unit,data.dest).then(function (unit) {
        self.get('eventManager').trigger('rerender');
//       unit.parent
//       self.store.findRecord('unit', get(unit,data.dest).then(function (unit) {
//         get(unit, 'members').removeObject(member);
//         get(member, 'units').removeObject(unit);
//       });
    });

    /*
    var unit = this.store.createRecord('unit');
      this.store.findRecord('unit', data.id).then(function (punit) {
        get(punit, 'units').pushObject(unit);
        self.get('eventManager').trigger('rerender');
      });
      */
  },

});
