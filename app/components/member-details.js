import Ember from 'ember';

export default Ember.Component.extend({
  draggable: false,
  droppable: true,
  selectable: true,
  unassign: false,
  attributeBindings: ["memberid:data-memberid"],
  memberid: Ember.computed.alias('member.id'),
  lastElement: null,
  lastColor: null,

  setup: Ember.on('didInsertElement', function() {
    if (!this.get('draggable')) {
      return;
    }

    this.$().draggable({
      tolerance: 'pointer',
      helper: 'clone',
      cursorAt: { left: -5, top: -5 }, 
      zIndex: 10,
      revert: true,
      drag: Ember.$.proxy(this.onDrag, this),
      stop: Ember.$.proxy(this.onDropped, this),
    });
  }),

  onDrag: function(e) {
    var el = this.getElementId(e);
    var matches = el.unitid !== undefined;
    $('body').css("cursor", function() {
      return (matches) ? "copy" : "move";
    });
    var last = this.get('lastElement');
    if (matches && el.isSvg) {
      this.setLast(e.toElement);
    } else {
      this.resetLast();
    }
    $(e.target).draggable("option","revertDuration",(matches) ? 0 : 100)
  },

  onDropped: function (event, ui) {
    this.resetLast();
    // Dropped on a non-matching target.
    var elm = this.getElementId(event);
    var unitid = elm.unitid;
    if (!unitid) {
      console.debug("no match");
      return;
    }

    var id = parseInt($(event.target).data('memberid'));
    Ember.$(".debug").empty();
    Ember.$(".debug").append('assign member:' + id + ' to unit: ' + unitid + " as " + elm.dest);

    $("body").css("cursor","");
  },

  resetLast: function() {
    var last = this.get('lastElement');
    if (last) {
      $(last).css({ fill: this.get('lastColor')});

      var classes = $(last).attr("class");
      if (classes) {
        classes = classes.split(" ");
        var idx = classes.indexOf("drop-hover");
        if (idx >= 0) {
          classes.splice(idx, 1);
          $(last).attr("class", classes.join(" "));
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
    this.set('lastColor', $(element).css('fill'));
    $(element).removeAttr("style");
    var classes = $(element).attr("class");
//     console.debug(">>> classes", classes);
    if (classes) {
      classes = classes.split(" ");
    } else {
      classes = [];
    }
    classes.push("drop-hover");
    $(element).attr("class", classes.join(" "));
  },

  getElementId: function(item) {
//     var id = $(item.toElement).data('unitid');
    var id;
    var dest = "";

//     console.debug("i", $(item.toElement).data('unitid'));
//     console.debug("p", $(item.toElement).closest( ".unit-pilots-container" ).data('unitid'));
//     console.debug("l", $(item.toElement).closest( ".unit-leader-container" ).data('unitid'));
//     console.debug("u", $(item.toElement).closest( ".unit-name-container" ).data('unitid'));

    if (!id) {
      id = $(item.toElement).closest( ".unit-pilots-container" ).data('unitid');
      console.debug("elm pilos");
      dest = "pilot"
    }
    
    if (!id) {
      id = $(item.toElement).closest( ".unit-leader-container" ).data('unitid');
//       console.debug("elm leader");
      dest = "leader"
//     } else {
//       console.debug(" else");
    }

  if (!id) {
      id = $(item.toElement).closest( ".unit-name-container" ).data('unitid');
      dest = "pilot";
  }

  if (!id) {
      dest = "else";
  }

//     console.debug(">>> ret", id, dest);
    return {unitid: id, dest: dest};
  },

  actions: {
    unassignMember: function() {
//       console.debug("uassing member", this.get('memberid'), 'from', this.get('member.unit.id'));
      Ember.$(".debug").empty();
      Ember.$(".debug").append( "uassing member", this.get('memberid'), 'from', this.get('member.unit.id'));
    }
  }
});
