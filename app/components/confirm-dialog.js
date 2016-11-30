import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;

export default Ember.Component.extend({
  classNames: ['confirm-dialog'],
  showDialog: false,
  msg: { "type": "", "title": "", "content": "" },

//   setup: Ember.on('init', function() {
//     var msg = get(this, "msg");
//     console.debug(">>> msg", msg);
//   }),


  actions: {
    close: function() {
      this.set("showDialog", false);
    },

    submitConfirm: function() {
      this.get('onConfirm')(get(this, "msg"));
    },
  }
});
