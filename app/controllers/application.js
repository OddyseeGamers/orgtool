import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;

export default Ember.Controller.extend({
  session: Ember.inject.service(),
  store: Ember.inject.service(),
  eventManager: Ember.inject.service('events'),
  classNames: ['strech-tree'],
  loader: Ember.inject.service(),
  showDialog: false,
  pwd: "",

  setup: Ember.on('init', function() {
    this.get('eventManager').on('assign', this.assign.bind(this));
    this.get('eventManager').on('unassign', this.unassign.bind(this));



    this.get('eventManager').on('log', this.log.bind(this));
    this.get('eventManager').on('success', this.success.bind(this));
    this.get('eventManager').on('failure', this.failure.bind(this));
  }),

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



  actions: {
    login: function() {
      var pwd = get(this, 'pwd');
      var session = this.get('session');
      if (session.authenticate(pwd)) {
        this.success('logged in as ' + (session.isAdmin?"admin":"member"));
      } else {
        this.failure('login failed');
      }
    }
  }

});
