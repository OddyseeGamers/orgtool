import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;

export default Ember.Controller.extend({
  session: Ember.inject.service(),
  store: Ember.inject.service(),
  eventManager: Ember.inject.service('events'),
  classNames: ['strech-tree'],
  showDialog: false,
  showBG: true,

  setup: Ember.on('init', function() {
    this.get('eventManager').on('assign', this.assign.bind(this));
    this.get('eventManager').on('unassign', this.unassign.bind(this));


    this.get("session").log("init", "");


    this.get('eventManager').on('log', this.log.bind(this));
    this.get('eventManager').on('success', this.success.bind(this));
    this.get('eventManager').on('failure', this.failure.bind(this));

    var self = this;
    this.store.findRecord('reward', 7).then(function(lead) {
      self.set('leaderFilter', lead);
    });
    this.store.findRecord('reward', 8).then(function(mem) {
      self.set('memberFilter', mem);
    });
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
    console.log("data", data)
    var member = this.store.peekRecord('member', data.id);
    var unit = this.store.peekRecord('unit', data.dest);

    switch (data.destType) {
    case "member":
      unit.get('members').pushObject(member).save().catch(function(err) {
         unit.rollback();
      });
      break;
    case "leader":
      unit.get('leaders').pushObject(member).save().catch(function(err) {
         unit.rollback();
      });
      break;
    case "applicant":
      unit.get('applicants').pushObject(member).save().catch(function(err) {
         unit.rollback();
      });
      break;
    }
    
//     Ember.Logger.debug(">>>> assign", data, member.get("name"));

//     var cu = get(member, 'memberUnits');
//     var found = false;
//     var memUn;

//     for (var i = 0; i < get(cu, 'length') && !found; i++) {
//       var c = cu.objectAt(i);
//       if (get(c, 'unit.id') == get(unit, 'id')) {
//         found = true;
//         memUn = c;
//       }
//     }

//     if (!found) {
//       memUn = this.store.createRecord('memberUnit');
//       memUn.set('member', member);
//       memUn.set('unit', unit);
//       this.get("session").log("assign", 'assign member:' + data.id + ' to unit: ' + data.dest + ' as ' + data.destType);
//     } else {
//       this.get("session").log("assign", 'changing position of member:' + data.id + ' in unit: ' + data.dest + " to " + data.destType);
//     }

//     if (data.destType == "leader") {
//       memUn.set('reward', this.store.peekRecord('reward', 7));
// //       memUn.set('reward', this.leaderFilter);
//     } else if (data.destType == "member" || data.destType == "path") {
//       memUn.set('reward', this.store.peekRecord('reward', 8));
// //       memUn.set('reward', this.memberFilter);
//     } else if (data.destType == "applicant") {
//       memUn.set('reward', this.store.peekRecord('reward', 9));
// //       memUn.set('reward', this.memberFilter);
//     }

//       var self = this;
//       self.set('loading', true);
//       memUn.save().then(function() {
//         self.get("session").log("assign", "member assigned " + data.id);
//       }).catch(function(err) {
//         self.get("session").log("error", "assigning member " + data.id);
//         Ember.Logger.debug("assign err", err);
//         memUn.rollback();
//       });

  },


  unassign: function(data) {
    var member = this.store.peekRecord('member', data.id);
    var unit = this.store.peekRecord('unit', data.dest);

    var units = get(member, 'units');
    var found = false;
    var memUn;
    for (var i = 0; i < get(cu, 'length') && !found; i++) {
      var c = cu.objectAt(i);
      if (get(c, 'id') == get(unit, 'id')) {
        found = true;
        memUn = c;
      }
    }

    if (found) {
      var self = this;
      this.get("session").log("unassign", 'unassign member:' + data.id + ' from unit: ' + data.dest);
//       self.set('loading', true);
      memUn.destroyRecord().then(function() {
        self.get("session").log("unassign", "member unassigned " + data.id);
      }).catch(function(err) {
        self.get("session").log("error", "unassigning member " + get(member, 'id'));
        Ember.Logger.debug("unassign err", err);
        memUn.rollback();
      });
    }
  },



  actions: {
  }

});
