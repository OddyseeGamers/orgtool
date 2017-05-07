import Ember from 'ember';

var debug = Ember.Logger.debug;

export default Ember.Component.extend({
  session: Ember.inject.service(),
  eventManager: Ember.inject.service('events'),
  level: null,

  showUnits: false,
  showLeader: true,
  showMembers: true,
  showApplicants: true,

  //   seven: Ember.computed.filterBy('unit.memberUnits.@each', 'reward', 7),

  setup: Ember.on('init', function() {
    var level = this.get('level');
    var unit = this.get('unit');
    if (unit) {
      var leaders = unit.get('leaders');
      var members = unit.get('members');
      var aplicants = unit.get('applicants')

      this.set("leaders", leaders);
      this.set("members", members);
      this.set("applicants", aplicants);
    }

    this.set('showUnits', level > 0);
    //     this.set('showLeader', level > 0);
    //     this.set('showMembers', level > 0);
  }),

  setupDrops: Ember.on('didInsertElement', function() {
    var unit = this.get('unit');
    if (unit) {
      this.$(".unit-pilots-container").droppable({
        tolerance: 'pointer',
        hoverClass: 'hovered',
      });

      this.$(".unit-leader-container").droppable({
        tolerance: 'pointer',
        hoverClass: 'hovered',
      });
      this.$(".unit-name-container").droppable({
        tolerance: 'pointer',
        hoverClass: 'hovered',
      });
    }
  }),

  onNodeDropped: function(event, ui) {
    var id = parseInt(ui.draggable.data('memberid'));
    var unitid = $(event.target).data('unitid');
    Ember.Logger.debug("droped here", id, unitid);
  },

  actions: {
    toggleUnits: function() {
      this.set('showUnits', ! this.get('showUnits'));
      Ember.Logger.debug("showUnits", this.get('showUnits'));
    },
    toggleLeader: function() {
      this.set('showLeader', ! this.get('showLeader'));
    },
    toggleMembers: function() {
      this.set('showMembers', ! this.get('showMembers'));
    },
    toggleApplicants: function() {
      this.set('showApplicants', ! this.get('showApplicants'));
    },

    unassignMember: function(member) {
      console.log("unassign!", member)
      this.get('eventManager').trigger('unassign', { 'id': member.get('id'), 'type': 'member', 'dest': this.get('unit.id'), 'destType': "unit" } );
    },


    addUnit: function() {
        Ember.Logger.log("ADD UNNIT ");
      this.get('eventManager').trigger('addUnit', { 'id': this.get('unit.id'), 'type': 'unit', 'unitType': 6 } );
    },
    addGame: function() {
      this.get('eventManager').trigger('addGame', { 'id': this.get('unit.id'), 'type': 'game', 'unitType': 2 } );
    },
    editUnit: function() {
      this.get('eventManager').trigger('editUnit', { 'id': this.get('unit.id'), 'type': "unit", 'unit': this.get('unit') } );
    },
    deleteUnit: function() {
      this.get('eventManager').trigger('deleteUnit', { 'id': this.get('unit.id'), 'type': "unit", 'unit': this.get('unit') } );
    }
  }
});
