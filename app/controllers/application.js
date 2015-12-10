import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;

export default Ember.Controller.extend({
  store: Ember.inject.service(),
  eventManager: Ember.inject.service('events'),
  classNames: ['strech-tree'],
  loading: true,

  setup: Ember.on('init', function() {
    this.get('eventManager').on('assign', this.assign.bind(this));
    this.get('eventManager').on('unassign', this.unassign.bind(this));
    this.get('eventManager').on('addUnit', this.addUnit.bind(this));
    this.get('eventManager').on('editUnit', this.editUnit.bind(this));
    this.get('eventManager').on('deleteUnit', this.deleteUnit.bind(this));

    this.get('eventManager').on('log', this.log.bind(this));
    this.get('eventManager').on('success', this.success.bind(this));
    this.get('eventManager').on('failure', this.failure.bind(this));

    this.get('eventManager').on('setLoading', this.setLoading.bind(this));

    var self = this;
//     this.set('loading', true);
//     self.log("loading units")
    this.store.findAll('unitType').then(function(unitTypes) {
      console.debug("found units")
      self.log("loading members")
      self.set('unitTypes', unitTypes);
      self.get('eventManager').trigger('rerender');

      self.store.findAll('member').then(function(members) {
        console.debug("found member")
        self.success("loading done")
          self.set('loading', false);
          self.set('members', members);
      });
    });
  }),


  setLoading: function(set) {
    console.debug(">>>> set loading", set);
    this.set('loading', set);
  },

  success: function(text) {
    this.set('unit', null);
    this.set('dialog', false);
    this.set('loading', false);

    Ember.$(".debug").empty();
    Ember.$(".debug").append(text + ' <i class="fa fa-check text-success"></i>');
  },

  failure: function(text) {
    this.set('loading', false);

    Ember.$(".debug").empty();
    Ember.$(".debug").append('<span class="text-danger">error</span> ' + text + ' <i class="fa fa-close text-danger"></i>');
  },

  log: function(text) {
    Ember.$(".debug").empty();
    Ember.$(".debug").append(text);
  },

  assign: function(data) {
    log('assign member:' + data.id + ' to unit: ' + data.dest + " as " + data.destType);

    var self = this;
    this.store.findRecord('member', data.id).then(function (member) {
      self.store.findRecord('unit', data.dest).then(function (unit) {
        get(unit, 'members').pushObject(member);
        get(member, 'units').pushObject(unit);
      });
    });
  },


  unassign: function(data) {
    log('unassign member:' + data.id + ' to unit: ' + data.dest + " from " + data.destType);

    var self = this;
    this.store.findRecord('member', data.id).then(function (member) {
      self.store.findRecord('unit', data.dest).then(function (unit) {
        get(unit, 'members').removeObject(member);
        get(member, 'units').removeObject(unit);
      });
    });
  },

  addUnit: function(data) {
    this.log('add unit to ' + data.id);
    var self = this;
    self.set('loading', true);
    this.store.findRecord('unit', data.id).then(function (punit) {
      var unit = self.store.createRecord('unit');
      set(unit, 'parent', punit);
      get(punit, 'units').pushObject(unit);
      self.set('unit', unit);
        self.set('dialog', true);
//       self.get('eventManager').trigger('rerender');
      self.set('loading', false);
    });
  },

  editUnit: function(data) {
    this.log('edit unit ' + data.id);
    this.set('unit', data.unit);
    this.set('dialog', true);
  },

  deleteUnit: function(data) {
    this.log('delete unit ' + data.id);
    var self = this;
    self.set('loading', true);
    this.store.deleteRecord(data.unit);

    data.unit.save().then(function(nunit) {
      self.success('unit deleted ' + data.id);
      self.get('eventManager').trigger('rerender');
    }).catch(function(err) {
      self.failure("deleting " + data.get(unit, 'id'));
      console.debug("del err", err);
      data.unit.rollback();
      self.get('eventManager').trigger('rerender');
    });
//     self.get('eventManager').trigger('rerender');
        /*
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
*/
    /*
    var unit = this.store.createRecord('unit');
      this.store.findRecord('unit', data.id).then(function (punit) {
        get(punit, 'units').pushObject(unit);
        self.get('eventManager').trigger('rerender');
      });
      */
  },

  actions: {
    submit: function() {
      var unit = get(this, 'unit');
      var self = this;

      self.set('dialog', false);
      if (!unit.get('hasDirtyAttributes')) {
        self.log("done unit " + get(unit, 'id'));
        self.set('unit', null);
        self.set('loading', false);
        return;
      }

      self.set('loading', true);
      unit.save().then(function(nunit) {
        self.success("unit saved " + get(nunit, 'id'));
        console.debug("save ok", nunit);
      }).catch(function(err) {
        self.failure("saving " + get(unit, 'id'));
        console.debug("save err", err);
        self.set('dialog',true);
//         unit.rollback();
        self.get('eventManager').trigger('rerender');
      });
    },

    close: function() {
      var unit = get(this, 'unit');
      var self = this;
      self.set('dialog', false);
      if (unit.get('hasDirtyAttributes')) {
        unit.rollback();
        self.log("discarded unit " + get(unit, 'id'));
        self.set('unit', null);
        self.set('loading', false);
        return;
      } else {
        self.log("done unit " + get(unit, 'id'));
      }
    },

    setType: function(type) {
      set(this, 'unit.type', type);
    },
  }

});
