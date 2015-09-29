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
    }
    this.set('lastElement', null);
    this.set('lastColor', null);
  },

  setLast: function(element) {
    this.resetLast();
    var last = this.get('lastElement');
    if (last) {
      $(last).css({ fill: this.get('lastColor')});
    }

    this.set('lastElement', element);
    this.set('lastColor', $(element).css('fill'));
    $(element).css({ fill: "#424242"});
  },

  draggedMatchesTarget: function(item) {
    return this.getElementId(item).unitid !== undefined;
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
