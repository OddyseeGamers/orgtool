import Ember from 'ember';
// import Moment from 'moment';

var get = Ember.get;
var set = Ember.set;
var debug = Ember.Logger.log;

export default Ember.Controller.extend({
  store: Ember.inject.service(),
  eventManager: Ember.inject.service('events'),
  session: Ember.inject.service('session'),

  grouped: Ember.computed('model', 'model.rewards', function() {
//     console.debug(">>>> setup GROUPS")
    var types = this.store.peekAll("rewardType");
    if (Ember.isEmpty(types)) {
      return [];
    }
    var temp = types.toArray().sort(function(a, b) {
      return Ember.compare(get(a, 'numericLevel'), get(b, 'numericLevel'));
    });

    var group = []; //Ember.A();
    var rt_lookup = [];
    var idx = 0;

    temp.forEach(function(t) {
      group.push({id: get(t, "id"), name: get(t, "name"), rewards: []});
      rt_lookup[get(t, "id")] = idx;
      idx++;
    });

    var self = this;
    get(this, 'model').get("rewards").forEach(function(nrew) {
        if (!Ember.isEmpty(get(nrew, "rewardType.id"))) {
          var gidx = rt_lookup[get(nrew, "rewardType.id")];
          var nr = {id: get(nrew, "id"), name: get(nrew, "name"), img: get(nrew, "img"), units: []};
          group[gidx].rewards.push(nr);
        }
    });

    return group;
  }),

  actions: {
    rewardPlayer: function(reward) {
      var player = get(this, "model");
      get(player, "rewards").pushObject(reward);
      player.save().then(function(done) {
//         debug("saved....", get(done, "id"));
//         player.reload();
      }).catch(function(err) {
        debug("player reward save failed, err", err);
      });
    },

    applyMember: function(unit) {
//       Ember.Logger.debug("apply mem to unit", get(this, "model.name"), unit);
      this.get('eventManager').trigger('assign', { 'id': get(this, "model.id"), 'type': 'player', 'dest': unit, 'destType': "applicant" } );
    },

    unassignMember: function(player, unit) {
      Ember.Logger.debug("unassign mem from unit");
    },

    showConfirm: function(unit, type) {
      set(this, "msg", { "type": "delete", "item": { unit: unit, type: type}, "title": "Leave Unit?", "content": "Do you really want to leave the unit " + unit.get("name") + "?" });
      set(this, "showConfirmDialog", true);
    },

    onConfirmed: function(msg) {
//       Ember.Logger.debug("on confirm");
      var struct = get(msg, "item");
      var element = struct.unit
      var typename = element.get('constructor.modelName');
      Ember.Logger.debug("element", typename, "===", element);

      this.get('eventManager').trigger('unassign', { 'player': get(this, "model"), 'unit': element, 'type': struct.type } );

//       this.get('eventManager').trigger('unassign', { 'id': get(this, "model.id"), 'dest': get(element, "id") } );
      set(this, "showConfirmDialog", false);

/*
      if (element && typename) {
        if (get(msg, "type") == "delete") {
          var self = this;

          element.destroyRecord().then(function(nitem) {
            get(self, "session").log(typename, element.get("id") + " deleted");
          }).catch(function(err) {
            get(self, "session").log("error", "could not delete " + typename + " " + element.get("name"));
            Ember.Logger.log("error deleting", err);
          }).finally(function() {
            set(self, "showConfirmDialog", false);
          });
        }
      } else {
        set(this, "showConfirmDialog", false);
      }
      */
    },
  },
});
