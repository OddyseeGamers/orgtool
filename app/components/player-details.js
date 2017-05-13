import Ember from 'ember';

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
    //   Ember.onerror = function(error) {
    //     console.log("An error has occurred in ember: " + error.message);
    // };
    if (!this.get('canDrag')) {
      return;
    }
//     debug(">> init", Ember.get(this, "playerid"));
    this.get("store").findRecord("player", Ember.get(this, "playerid"));

    this.createDraggable();
  }),

  reinit_2: function() {
    Ember.Logger.log(">>> player cachanged" );
//     if (!this.get('canDrag')) {
//       return;
//     }
//     if (this.$().data('ui-draggable') === undefined) {
//       this.createDraggable();
//     }
  }.observes('player'),

  reinit: function() {
    Ember.Logger.log(">>> reinit" );
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
    debug("DROP");
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

    //     Ember.Logger.debug("i", $(item.toElement).data('unitid'));
    //     Ember.Logger.debug("p", $(item.toElement).closest( ".unit-pilots-container" ).data('unitid'));
    //     Ember.Logger.debug("l", $(item.toElement).closest( ".unit-leader-container" ).data('unitid'));
    //     Ember.Logger.debug("u", $(item.toElement).closest( ".unit-name-container" ).data('unitid'));

    if (!id) {
      id = this.$(item.originalEvent.target).closest( ".unit-pilots-container" ).data('unitid');
      dest = "player"
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
      //this.store.findRecord('unit', unitid).then(function(lead) {
      console.log("unassign", player, unit, type);
      //});
      switch (type) {
      case "leaders":
        unit.get('leaders').removeObject(player);
        unit.save();
        break;
      case "players":
        unit.get('players').removeObject(player);
        unit.save();
        break;
      case "applicants":
        unit.get('applicants').removeObject(player);
        unit.save();
        break;
      }
      //this.get('eventManager').trigger('unassign', { 'id': player.get('id'), 'type': 'player', 'dest': unitid, 'destType': "unit" } );
    },

  }

});
