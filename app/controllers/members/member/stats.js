import Ember from 'ember';
// import Moment from 'moment';

var get = Ember.get;
var set = Ember.set;

export default Ember.Controller.extend({
//   store: Ember.inject.service(),
  eventManager: Ember.inject.service('events'),
  session: Ember.inject.service('session'),

//   remainingChores: Ember.computed.filterBy('chores', 'done', false)
  filteredTypes: Ember.computed.filter('rewardTypes', function(t, index, array) {
    return t.id > 2;
  }),

  setup: Ember.on('init', function() {
    this.set("rewardTypes", this.store.findAll("rewardType"));
  }),

  actions: {
    applyMember: function(unit) {
//       console.debug("apply mem to unit", get(this, "model.name"), unit);
      this.get('eventManager').trigger('assign', { 'id': get(this, "model.id"), 'type': 'member', 'dest': unit, 'destType': "applicant" } );
    },

    unassignMember: function(member, unit) {
      console.debug("unassign mem from unit");
    },

    showConfirm: function(memUn) {
      set(this, "msg", { "type": "delete", "item": memUn, "title": "Leave Unit?", "content": "Do you really want to leave the unit " + memUn.get("unit.name") + "?" });
      set(this, "showConfirmDialog", true);
    },

    onConfirmed: function(msg) {
//       console.debug("on confirm");
      var element = get(msg, "item");
      var typename = element.get('constructor.modelName');
//       console.debug("element type", typename);

      if (element && typename) {
        if (get(msg, "type") == "delete") {
          var self = this;

          element.destroyRecord().then(function(nitem) {
            get(self, "session").log(typename, nitem.get("name") + " deleted");
          }).catch(function(err) {
            get(self, "session").log("error", "could not delete " + typename + " " + element.get("name"));
            console.debug("error deleting", err);
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
