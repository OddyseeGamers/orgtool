import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;

export default Ember.Controller.extend({
  session: Ember.inject.service(),
  store: Ember.inject.service(),
  eventManager: Ember.inject.service('events'),
  classNames: ['strech-tree'],
  loading: true,
  pwd: "",

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
    this.log('assign member:' + data.id + ' to unit: ' + data.dest);

    var member = this.store.peekRecord('member', data.id);
    var unit = this.store.peekRecord('unit', data.dest);
    get(unit, 'members').pushObject(member);
    get(member, 'units').pushObject(unit);

  },


  unassign: function(data) {
    this.log('unassign member:' + data.id + ' from unit: ' + data.dest);

    var member = this.store.peekRecord('member', data.id);
    var unit = this.store.peekRecord('unit', data.dest);
    get(unit, 'members').removeObject(member);
    get(member, 'units').removeObject(unit);
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

  hashCode: function(str) {
    var hash = 0, i, chr, len;
    if (str.length === 0) return hash;
    for (i = 0, len = str.length; i < len; i++) {
      chr   = str.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  },


  actions: {
    submit: function() {
      var unit = get(this, 'unit');
      var self = this;

      self.set('dialog', false);
//       if (!unit.get('hasDirtyAttributes')) {
//         self.log("done unit " + get(unit, 'id'));
//         self.set('unit', null);
//         self.set('loading', false);
//         return;
//       }

      console.debug("save", unit.get('hasDirtyAttributes'), " - " , unit.get('type.name'), ' = ', unit.get('type.hasDirtyAttributes') );
      self.set('loading', true);
      unit.save().then(function(nunit) {
        self.success("unit saved " + get(nunit, 'id'));
        console.debug("save ok", nunit);
        self.set('unit', null);
        self.set('loading', false);
        self.set('dialog',false);
        self.get('eventManager').trigger('rerender');
        self.store.findAll('unitType').then(function(unitTypes) {
          self.set('unitTypes', unitTypes);
        });
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
      var unit = get(this, 'unit');
      unit.set('type', type);
    },

    login: function() {
      var pwd = get(this, 'pwd');
      var session = this.get('session');
      if (session.authenticate(pwd)) {
        this.success('login as admin');
      }
    }
  }

});
