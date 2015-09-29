import Ember from 'ember';

export default Ember.Component.extend({
  draggable: false,
  droppable: true,
  selectable: true,
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
    var unitid = this.getElementId(event).unitid;
    if (!unitid) {
      console.debug("no match");
      return;
    }

    var id = parseInt($(event.target).data('memberid'));
    console.debug("droped here", id, unitid);
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
          console.debug("before", classes);
          classes.splice(idx, 1);
          console.debug("after", classes);
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
    console.debug(">>> classes", classes);
    if (classes) {
      classes = classes.split(" ");
    } else {
      classes = [];
    }
    classes.push("drop-hover");
    $(element).attr("class", classes.join(" "));
  },

  getElementId: function(item) {
    var id = $(item.toElement).data('unitid');
    var svg = false;
    if (!id) {
      id = $(item.toElement).closest( ".unit-pilots-container" ).data('unitid');
    } else {
      svg = true;
    }
    return {unitid: id, isSvg: svg};
  },
});
