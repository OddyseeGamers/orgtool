import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  eventManager: Ember.inject.service('events'),
  unit: null,
  collapseUnits: null,
  collapseLeader: null,
  collapsePilots: null,

  setup: Ember.on('init', function() {
    this.set('collapseUnits', true);
    this.set('collapseLeader', true);
    this.set('collapsePilots', true);
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

  showUnits: Ember.computed.bool('collapseUnits'),
  showLeader: Ember.computed.bool('collapseLeader'),
  showPilots: Ember.computed.bool('collapsePilots'),

  onNodeDropped: function(event, ui) {
    var id = parseInt(ui.draggable.data('memberid'));
    var unitid = $(event.target).data('unitid');
    console.debug("droped here", id, unitid);
  },

  actions: {
    toggleUnits: function() {
      this.set('collapseUnits', ! this.get('collapseUnits'));
    },
    toggleLeader: function() {
      this.set('collapseLeader', ! this.get('collapseLeader'));
    },
    togglePilots: function() {
      this.set('collapsePilots', ! this.get('collapsePilots'));
    },
    unassignMember: function(member) {
      this.get('eventManager').trigger('unassign', { 'id': member.get('id'), 'type': 'member', 'dest': this.get('unit.id'), 'destType': "unit" } );
    },
    addUnit: function() {
      this.get('eventManager').trigger('addUnit', { 'id': this.get('unit.id'), 'type': "unit" } );
    },
    deleteUnit: function() {
      this.get('eventManager').trigger('deleteUnit', { 'id': this.get('unit.id'), 'type': "unit" } );
    }
  }
});
