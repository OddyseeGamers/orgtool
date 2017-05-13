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
      self.set('playerFilter', mem);
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
    console.log("DO IT data", data)

    var self = this;
    return this.store.findRecord('player', data.id).then(function(player) {
      console.log("find 1", player);
      return self.store.findRecord('unit', data.dest).then(function(unit) {
        console.log("find 2", unit);
        switch (data.destType) {
        case "path":
        case "player":
          console.log(" -> player")
//           return player.get('playerships').pushObject(unit).save().then(function(np) {
//             console.log(" -> save ok", np)
//           }).catch(function(err) {
//             console.log(" -> err", err);
//              unit.rollback();
//           });

          unit.get('players').pushObject(player).save().then(function(np) {
            console.log(" -> save ok", np)
          }).catch(function(err) {
            console.log(" -> err", err);
//              unit.rollback();
          });
 
//           .catch(function(err) {
//              unit.rollback();
//           });
          break;
        case "leader":
          console.log(" -> leader")

          unit.get('leaders').pushObject(player).save().catch(function(err) {
             unit.rollback();
          });
          break;
        case "applicant":
          console.log(" -> applicants")
          unit.get('applicants').pushObject(player).save().catch(function(err) {
             unit.rollback();
          });
          break;
        }
      

      });
    });

//     var player = this.store.peekRecord('player', data.id);
//     var unit = this.store.peekRecord('unit', data.dest);






    
//     Ember.Logger.debug(">>>> assign", data, player.get("name"));

//     var cu = get(player, 'playerUnits');
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
//       memUn = this.store.createRecord('playerUnit');
//       memUn.set('player', player);
//       memUn.set('unit', unit);
//       this.get("session").log("assign", 'assign player:' + data.id + ' to unit: ' + data.dest + ' as ' + data.destType);
//     } else {
//       this.get("session").log("assign", 'changing position of player:' + data.id + ' in unit: ' + data.dest + " to " + data.destType);
//     }

//     if (data.destType == "leader") {
//       memUn.set('reward', this.store.peekRecord('reward', 7));
// //       memUn.set('reward', this.leaderFilter);
//     } else if (data.destType == "player" || data.destType == "path") {
//       memUn.set('reward', this.store.peekRecord('reward', 8));
// //       memUn.set('reward', this.playerFilter);
//     } else if (data.destType == "applicant") {
//       memUn.set('reward', this.store.peekRecord('reward', 9));
// //       memUn.set('reward', this.playerFilter);
//     }

//       var self = this;
//       self.set('loading', true);
//       memUn.save().then(function() {
//         self.get("session").log("assign", "player assigned " + data.id);
//       }).catch(function(err) {
//         self.get("session").log("error", "assigning player " + data.id);
//         Ember.Logger.debug("assign err", err);
//         memUn.rollback();
//       });

  },


  unassign: function(data) {
    var player = this.store.peekRecord('player', data.id);
    var unit = this.store.peekRecord('unit', data.dest);

    var units = get(player, 'units');
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
      this.get("session").log("unassign", 'unassign player:' + data.id + ' from unit: ' + data.dest);
//       self.set('loading', true);
      memUn.destroyRecord().then(function() {
        self.get("session").log("unassign", "player unassigned " + data.id);
      }).catch(function(err) {
        self.get("session").log("error", "unassigning player " + get(player, 'id'));
        Ember.Logger.debug("unassign err", err);
        memUn.rollback();
      });
    }
  },



  actions: {
  }

});
