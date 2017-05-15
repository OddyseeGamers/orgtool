import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;
var debug = Ember.Logger.log;

export default Ember.Component.extend({
  classNames: ['player-details'],
  classNameBindings: ['canDrag:player-details-draggable'],
  //   classNameBindings: ['isUrgent:urgent'],
  store: Ember.inject.service(),
  draggable: false,
  droppable: true,
  selectable: true,
  unit: null,
  type: null,
  attributeBindings: ["playerid:data-playerid"],
  playerid: Ember.computed.alias('player.id'),
  lastElement: null,
  lastColor: null,
  canDrag: Ember.computed.and('draggable', 'session.current_user.permission.unit_assign'),
  canUnassign: Ember.computed.and('unit', 'session.current_user.permission.unit_assign'),

  eventManager: Ember.inject.service('events'),
  session: Ember.inject.service('session'),

  setup: Ember.on('didInsertElement', function() {
//     debug(">> init", Ember.get(this, "player.id"));
    if (!this.get('canDrag')) {
      return;
    }
    this.createDraggable();
  }),


  mergedUnits: function() {
//     Ember.Logger.log(">>> player cachanged" );
    var res = Ember.A();
    res.pushObjects(get(this, 'player.leaderships').toArray());
    res.pushObjects(get(this, 'player.playerships').toArray());
    res.pushObjects(get(this, 'player.applications').toArray());
    return res;
  }.property('player.leaderships', 'player.playerships', 'player.applications'),
//   }.property('player'),


  reinit: function() {
//     Ember.Logger.log(">>> reinit" );
    if (!this.get('canDrag')) {
      return;
    }
    if (this.$().data('ui-draggable') === undefined) {
      this.createDraggable();
    }
  }.observes('session.current_user.permission.unit_assign'),

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
//     debug("drag", matches);
    this.$('body').css("cursor", function() {
      return (matches) ? "copy" : "move";
    });
    //     var last = this.get('lastElement');
//     debug("dest", el);
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
//     debug("DROP", unitid);
    if (!unitid) {
      //       Ember.Logger.debug("no match");
      return;
    }

    var id = parseInt(this.$(event.target).data('playerid'));
    debug("assign", id);
    this.get('eventManager').trigger('assign', { 'id': id, 'type': 'player', 'dest': unitid, 'destType': elm.dest } );
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

    if (!id) {
      id = this.$(item.originalEvent.target).closest( ".unit-pilots-container" ).data('unitid');
      dest = this.$(item.originalEvent.target).closest( ".unit-pilots-container" ).data('dest');
    }

    if (!id) {
      id = this.$(item.originalEvent.target).closest( ".unit-name-container" ).data('unitid');
      dest = "player";
    }

    if (!id) {
      id = this.$(item.originalEvent.target).closest( ".unit-pilots-path" ).data('unitid');
      dest = "path";
    }

    //     Ember.Logger.debug(">>> ret", id, dest);
    return {unitid: id, dest: dest};
  },

  loadError(img) {
    Ember.$(img.target).attr("src", Ember.get(this, "session").rootURL + "/player.png");
    //     set(img, "src", get(this, "session").rootURL + "/player.png");
    return true;
  },

  actions: {
    unassignMember: function(player, unit, type) {
      this.get('eventManager').trigger('unassign', { 'player': player, 'unit': unit, 'type': type } );
    },
  }
});
