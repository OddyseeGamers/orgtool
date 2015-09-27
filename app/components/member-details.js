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

    this.$().draggable({
//       cursor: 'move',
      helper: 'clone',
      zIndex: 10,
      //         revert: true,
      cursorAt: { left: 0, top: 0 }, 
      revertDuration: 100,
      revert: true
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
});
