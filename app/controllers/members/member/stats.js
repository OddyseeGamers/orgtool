import Ember from 'ember';
// import Moment from 'moment';

var get = Ember.get;
var set = Ember.set;
var debug = Ember.Logger.log;

export default Ember.Controller.extend({
  store: Ember.inject.service(),
  eventManager: Ember.inject.service('events'),
  session: Ember.inject.service('session'),

  grouped: Ember.computed('model', function() {
    var types = this.store.peekAll("rewardType");
    var temp = types.toArray().sort(function(a, b) {
      return Ember.compare(get(a, 'numericLevel'), get(b, 'numericLevel'));
    });

    var group = Ember.A();
    var rt_lookup = [];
    var idx = 0;

    temp.forEach(function(t) {
      group.push({id: get(t, "id"), name: get(t, "name"), rewards: []});
      rt_lookup[get(t, "id")] = idx;
      idx++;
    });

    get(this, 'model').get("memberRewards").forEach(function(mr) {
      var gidx = rt_lookup[get(mr, "reward").get("type").get('id')];
      var or = get(mr, "reward");
      var nr = {id: get(or, "id"), name: get(or, "name"), img: get(or, "img"), units: []};

      group[gidx].rewards.push(nr);
    });

    // Rewards are no longer assigned to units
    // get(this, 'model').get("memberUnits").forEach(function(mu) {
    //   var gidx = rt_lookup[get(mu, "reward").get("type").get('id')];
    //   var or = get(mu, "reward");
    //   var ou = get(mu, "unit");
    //   var nu = { name: get(ou, "name"), img: get(ou, "img"), mu: mu };

    //   if (group[gidx].rewards.length) {
    //     var res = group[gidx].rewards.find(function(r) {
    //       return get(r, "id") == get(or, "id");
    //     });
    //     if (res) {
    //       res.units.push(nu);
    //     } else {
    //       var nr = {id: get(or, "id"), name: get(or, "name"), img: get(or, "img"), units: [ nu ]};
    //       group[gidx].rewards.push(nr);
    //     }
    //   } else {
    //     var nr = {id: get(or, "id"), name: get(or, "name"), img: get(or, "img"), units: [ nu ]};
    //     group[gidx].rewards.push(nr);
    //   }

    // });

    return group;
  }).property('model', 'model.memberRewards.length', 'model.memberUnits.length', 'showConfirmDialog'),


  actions: {
    applyMember: function(unit) {
//       Ember.Logger.debug("apply mem to unit", get(this, "model.name"), unit);
      this.get('eventManager').trigger('assign', { 'id': get(this, "model.id"), 'type': 'member', 'dest': unit, 'destType': "applicant" } );
    },

    unassignMember: function(member, unit) {
      Ember.Logger.debug("unassign mem from unit");
    },

    showConfirm: function(memUn) {
      set(this, "msg", { "type": "delete", "item": memUn, "title": "Leave Unit?", "content": "Do you really want to leave the unit " + memUn.get("unit.name") + "?" });
      set(this, "showConfirmDialog", true);
    },

    onConfirmed: function(msg) {
//       Ember.Logger.debug("on confirm");
      var element = get(msg, "item");
      var typename = element.get('constructor.modelName');
//       Ember.Logger.debug("element", typename, "===", element);

      if (element && typename) {
        if (get(msg, "type") == "delete") {
          var self = this;

          element.destroyRecord().then(function(nitem) {
            get(self, "session").log(typename, nitem + " deleted");
//             debug(">>>>>>>>", nitem, self.grouped);
//             self.grouped;
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
    },

  },

});
