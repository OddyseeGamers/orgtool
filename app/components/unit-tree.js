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

  leaders: Ember.computed('unit.memberUnits.@each.reward', function() {
    var mems = this.get('unit').get('memberUnits');
    var re = Ember.A();
    var ap = Ember.A();
    var lead = Ember.A();
    for (var i = 0; i < mems.get("length"); i++) {
      if (mems.objectAt(i).get("reward").get("id") == "7") {
        lead.pushObject(mems.objectAt(i).get("member"));
      } else if (mems.objectAt(i).get("reward").get("id") == "8") {
        re.pushObject(mems.objectAt(i).get("member"));
      } else if (mems.objectAt(i).get("reward").get("id") == "9") {
        ap.pushObject(mems.objectAt(i).get("member"));
      }
    }
    this.set("members", re);
    this.set("applicants", ap);
    return lead;
  }),

//   seven: Ember.computed.filterBy('unit.memberUnits.@each', 'reward', 7),

  setup: Ember.on('init', function() {
    var level = this.get('level');
    debug(" LEVEL", this.get('unit'), " --- ",  level, "show", level > 0);
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
  //       zIndex: 10,
  //       over: function(event, ui) {
  //         ui.draggable.css("cursor", "copy");
  //       },
  //       out: function(event, ui) {
  //         ui.draggable.css("cursor", "no-drop");
  //       },
  //       over: function(){
  //         $('.unit-content').css('cursor','copy');
  //       },
  //       out: function(){
  //         $('.unit-content').css('cursor','no-drop');
  //       },
//         drop: Ember.$.proxy(this.onNodeDropped, this),
  //       over: Ember.$.proxy(this.onNodeOver, this),
  //       out: Ember.$.proxy(this.onNodeOut, this)
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
      this.get('eventManager').trigger('unassign', { 'id': member.get('id'), 'type': 'member', 'dest': this.get('unit.id'), 'destType': "unit" } );
    },


    addUnit: function() {
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
