import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;

export default Ember.Controller.extend({
  session: Ember.inject.service(),
  store: Ember.inject.service(),
  eventManager: Ember.inject.service('events'),
  classNames: ['strech-tree'],
  loading: true,
  showDialog: false,
  pwd: "",

  setup: Ember.on('init', function() {
    this.get('eventManager').on('assign', this.assign.bind(this));
    this.get('eventManager').on('unassign', this.unassign.bind(this));

    this.get('eventManager').on('addUnit', this.addUnit.bind(this));
    this.get('eventManager').on('addGame', this.addGame.bind(this));

    this.get('eventManager').on('editUnit', this.editUnit.bind(this));
    this.get('eventManager').on('deleteUnit', this.deleteUnit.bind(this));

    this.get('eventManager').on('log', this.log.bind(this));
    this.get('eventManager').on('success', this.success.bind(this));
    this.get('eventManager').on('failure', this.failure.bind(this));

    this.get('eventManager').on('setLoading', this.setLoading.bind(this));
  }),


  setLoading: function(set) {
    this.set('loading', set);
  },

  success: function(text) {
    this.set('unit', null);
    this.set('showDialog', false);
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
    var member = this.store.peekRecord('member', data.id);
    var unit = this.store.peekRecord('unit', data.dest);

    var cu = get(member, 'memberUnits');
    var found = false;
    for (var i = 0; i < get(cu, 'length') && !found; i++) {
      var c = cu.objectAt(i);
      if (get(c, 'unit.id') == get(unit, 'id')) {
        found = true;
      }
    }

    if (found) {
      this.log('member:' + data.id + ' is already assinged to unit: ' + data.dest);
    } else {
      var memUn = this.store.createRecord('memberUnit');
      memUn.set('member', member);
      memUn.set('unit', unit);

      this.log('assign member:' + data.id + ' to unit: ' + data.dest);
      var self = this;
      self.set('loading', true);
      memUn.save().then(function() {
        self.success('member assigned ' + data.id);
      }).catch(function(err) {
        self.failure("assigning member " + data.get(member, 'id'));
        console.debug("assign err", err);
        memUn.rollback();
      });
    }
  },


  unassign: function(data) {
    var member = this.store.peekRecord('member', data.id);
    var unit = this.store.peekRecord('unit', data.dest);

    var cu = get(member, 'memberUnits');
    var found = false;
    var memUn;
    for (var i = 0; i < get(cu, 'length') && !found; i++) {
      var c = cu.objectAt(i);
      if (get(c, 'unit.id') == get(unit, 'id')) {
        found = true;
        memUn = c;
      }
    }

    if (found) {
      var self = this;
      this.log('unassign member:' + data.id + ' from unit: ' + data.dest);
      self.set('loading', true);
      memUn.destroyRecord().then(function() {
        self.success('member unassigned ' + data.id);
      }).catch(function(err) {
        self.failure("unassigning member " + get(member, 'id'));
        console.debug("unassign err", err);
        memUn.rollback();
      });
    }
  },

  addUnit: function(data) {
    this.log('add unit to ' + data.id);
    var self = this;
    self.set('loading', true);
    this.store.findRecord('unit', data.id).then(function (punit) {
      self.store.findRecord('unitType', 6).then(function (unitType) {
        var unit = self.store.createRecord('unit');
        unit.set('type', unitType);
        set(unit, 'parent', punit);
        get(punit, 'units').pushObject(unit);
        self.set('unit', unit);
          self.set('showDialog', true);
  //       self.get('eventManager').trigger('rerender');
        self.set('loading', false);
      });
    });
  },

  addGame: function(data) {
    this.log('add game to ' + data.id);
    var self = this;
    self.set('loading', true);
    this.store.findRecord('unit', data.id).then(function (punit) {
      self.store.findRecord('unitType', 2).then(function (unitType) {
        var unit = self.store.createRecord('unit');
        unit.set('type', unitType);
        set(unit, 'parent', punit);
        get(punit, 'units').pushObject(unit);
        self.set('unit', unit);
          self.set('showDialog', true);
  //       self.get('eventManager').trigger('rerender');
        self.set('loading', false);
      });
    });
  },

  editUnit: function(data) {
    this.log('edit unit ' + data.id);
    var self = this;
//     this.store.findRecord('unit', data.id).then(function (unit) {
      self.set('unit', data.unit);
      self.set('showDialog', true);
//     });
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
  },


  actions: {
    submit: function() {
      var unit = get(this, 'unit');
      var self = this;

      self.set('showDialog', false);
//       if (!unit.get('hasDirtyAttributes')) {
//         self.log("done unit " + get(unit, 'id'));
//         self.set('unit', null);
//         self.set('loading', false);
//         return;
//       }

//       console.debug("save", unit.get('hasDirtyAttributes'), " - " , unit.get('type.name'), ' = ', unit.get('type.hasDirtyAttributes') );
      self.set('loading', true);
      unit.save().then(function(nunit) {
        self.success("unit saved " + get(nunit, 'id'));
        self.set('unit', null);
        self.get('eventManager').trigger('rerender');
//         self.store.findAll('unitType').then(function(unitTypes) {
//           self.set('unitTypes', unitTypes);
//         });
      }).catch(function(err) {
        self.failure("saving " + get(unit, 'id'));
        console.debug("save err", err);
        self.set('showDialog',true);
//         unit.rollback();
        self.get('eventManager').trigger('rerender');
      });
    },

    close: function() {
      var unit = get(this, 'unit');
      var self = this;
      self.set('showDialog', false);
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
      var unit = get(this, 'unit');
      unit.set('type', type);
    },

    login: function() {
      var pwd = get(this, 'pwd');
      var session = this.get('session');
      if (session.authenticate(pwd)) {
        this.success('logged in as admin');
      }
    }
  }

});
