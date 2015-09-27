import Ember from 'ember';

export default Ember.Component.extend({
  draggable: false,
  droppable: true,
  selectable: true,
  attributeBindings: ["memberid:data-memberid"],
  memberid: Ember.computed.alias('member.id'),

  setup: Ember.on('didInsertElement', function() {
//     this._super();
//     var view = this,
//     treeDraggingNodeView = this.get('treeDraggingNodeView');

    if (!this.get('draggable')) {
      return;
    }

    var self = this;

    this.$().draggable({
//       cursor: 'move',
//       tolerance: 'pointer',
      helper: 'clone',
      zIndex: 10,
      cursorAt: { left: -1, top: 0 }, 
      revert: true,
      drag: function (e) {
        var el = self.getElementId(event);
        var matches = el.unitid !== undefined;
        $('body').css("cursor", function() {
          return (matches) ? "copy" : "move";
        });
        if (el.isSvg) {
          $(el.dest).css({ fill: "#f00"});
        }
        $(e.target).draggable("option","revertDuration",(matches) ? 0 : 100)
      },
      stop: function (event, ui) {
        // Dropped on a non-matching target.
        var unitid = self.getElementId(event).unitid;
        if (!unitid) {
          console.debug("no match");
          return;
        }

        var id = parseInt($(event.target).data('memberid'));
//         var unitid = $(event.target).data('unitid');
        console.debug("droped here", id, unitid);
//         var id = parseInt(ui.draggable.data('memberid'));
//         var unitid = $(event.target).data('unitid');
//         console.debug("droped here", event);

//         $(e.target).draggable("disable");
        $("body").css("cursor","");
      }
//       appendTo: 'body',
      /*
      helper: function() {

        var treeDraggingNodeViewInstance = treeDraggingNodeView.create();

        treeDraggingNodeViewInstance.setProperties({
          node: view.get('node'),
          parentView: view,
          controller: view.get('controller')
        });

        view.set('_treeDraggingNodeView', treeDraggingNodeViewInstance.appendTo('#dragging'));

        return Ember.$('<span id="dragging"/>');
      },

      start: function() {
        var node = view.get('node'),
        selectedNodes = view.get('controller.selectedNodes');

        // If current dragging node isn't in selected nodes, we deselect all of them
        if (-1 === selectedNodes.indexOf(node)) {
          selectedNodes.forEach(function(node) {
            node.set('isSelected', false);
            view.get('controller').nodeSelectionStateChanged(node);
          }, this);
        }
      },

      stop: function() {
        view.get('_treeDraggingNodeView').destroy();
      }
      */
    });

//     console.debug("done", hmm);
  }),

  draggedMatchesTarget: function(item) {
    return this.getElementId(item).unitid !== undefined;
  },

  getElementId: function(item) {
    var id = $(item.toElement).data('unitid');
    var dest = null;
    var svg = false;
    if (!id) {
      id = $(item.toElement).closest( ".unit-pilots-container" ).data('unitid');
      if (id) {
        dest = $(item.toElement).closest( ".unit-pilots-container" );
      }
    } else {
      svg = true;
      dest = item.toElement;
    }
    return {unitid: id, isSvg: svg, obj: dest};
  },
});
