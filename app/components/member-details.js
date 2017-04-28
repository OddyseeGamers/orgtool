import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['member-details'],
  classNameBindings: ['canDrag:member-details-draggable'],
//   classNameBindings: ['isUrgent:urgent'],

  draggable: false,
  droppable: true,
  selectable: true,
  unitid: null,
  attributeBindings: ["memberid:data-memberid"],
  memberid: Ember.computed.alias('member.id'),
  lastElement: null,
  lastColor: null,
  canDrag: Ember.computed.and('draggable', 'session.isAdmin'),
  canUnassign: Ember.computed.and('unitid', 'session.isAdmin'),

  eventManager: Ember.inject.service('events'),
  session: Ember.inject.service('session'),

  setup: Ember.on('didInsertElement', function() {
    if (!this.get('canDrag')) {
      return;
    }

    this.createDraggable();
  }),

  reinit: function() {
    Ember.Logger.debug(">>> reinit" );
    if (!this.get('canDrag')) {
      return;
    }
    if (this.$().data('ui-draggable') === undefined) {
      this.createDraggable();
    }
  }.observes('session.isAdmin'),

  createDraggable: function() {
    this.$().draggable({
      tolerance: 'pointer',
      helper: 'clone',
      cursorAt: { left: -5, top: -5 }, 
//       zIndex: 1,
      stack: ".draggable",
      revert: true,
      scroll: false,
      appendTo: "body",
      cursor: "move",
      containment: "#mycontent",
      drag: Ember.$.proxy(this.onDrag, this),
      stop: Ember.$.proxy(this.onDropped, this),
    });
  },

  onDrag: function(e) {
    var el = this.getElementId(e);
    var matches = el.unitid !== undefined;
    this.$('body').css("cursor", function() {
      return (matches) ? "copy" : "move";
    });
//     var last = this.get('lastElement');
    if (matches && el.dest == "path") {
      this.setLast(e.toElement);
    } else {
      this.resetLast();
    }
    this.$(e.target).draggable("option","revertDuration",(matches) ? 0 : 100)
  },

  onDropped: function (event, ui) {
    this.resetLast();
    // Dropped on a non-matching target.
    var elm = this.getElementId(event);

    var unitid = elm.unitid;
    if (!unitid) {
//       Ember.Logger.debug("no match");
      return;
    }

    var id = parseInt(this.$(event.target).data('memberid'));
    this.get('eventManager').trigger('assign', { 'id': id, 'type': 'member', 'dest': unitid, 'destType': elm.dest } );
    this.$("body").css("cursor","");
  },

  resetLast: function() {
    var last = this.get('lastElement');
    if (last) {
      this.$(last).css({ fill: this.get('lastColor')});

      var classes = this.$(last).attr("class");
      if (classes) {
        classes = classes.split(" ");
        var idx = classes.indexOf("drop-hover");
        if (idx >= 0) {
          classes.splice(idx, 1);
          this.$(last).attr("class", classes.join(" "));
        }
      }
    }
    this.set('lastElement', null);
    this.set('lastColor', null);
  },

  setLast: function(element) {
    var last = this.get('lastElement');
    if (last === element) {
      return;
    }
    this.resetLast();
    this.set('lastElement', element);
    this.set('lastColor', this.$(element).css('fill'));
    this.$(element).removeAttr("style");
    var classes = this.$(element).attr("class");
//     Ember.Logger.debug(">>> classes", classes);
    if (classes) {
      classes = classes.split(" ");
    } else {
      classes = [];
    }
    classes.push("drop-hover");
    this.$(element).attr("class", classes.join(" "));
  },

  getElementId: function(item) {
//     var id = $(item.toElement).data('unitid');
    var id;
    var dest = "";

//     Ember.Logger.debug("i", $(item.toElement).data('unitid'));
//     Ember.Logger.debug("p", $(item.toElement).closest( ".unit-pilots-container" ).data('unitid'));
//     Ember.Logger.debug("l", $(item.toElement).closest( ".unit-leader-container" ).data('unitid'));
//     Ember.Logger.debug("u", $(item.toElement).closest( ".unit-name-container" ).data('unitid'));

    if (!id) {
      id = this.$(item.originalEvent.target).closest( ".unit-pilots-container" ).data('unitid');
      dest = "member"
    }
    
    if (!id) {
      id = this.$(item.originalEvent.target).closest( ".unit-leader-container" ).data('unitid');
//       Ember.Logger.debug("elm leader");
      dest = "leader"
//     } else {
//       Ember.Logger.debug(" else");
    }

  if (!id) {
      id = this.$(item.originalEvent.target).closest( ".unit-name-container" ).data('unitid');
      dest = "member";
  }

  if (!id) {
      id = this.$(item.originalEvent.target).closest( ".unit-pilots-path" ).data('unitid');
      dest = "path";
  }

//     Ember.Logger.debug(">>> ret", id, dest);
    return {unitid: id, dest: dest};
  },

  actions: {
    unassignMember: function(member, unitid) {
      this.get('eventManager').trigger('unassign', { 'id': member.get('id'), 'type': 'member', 'dest': unitid, 'destType': "unit" } );
    },
  }

});
