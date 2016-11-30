import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;

export default Ember.Component.extend({
  classNames: ['item-details'],
  store: Ember.inject.service(),
  session: Ember.inject.service('session'),
  details: false,

  actions: {
    deleteItem: function(item) {
      this.get('onConfirm')(item);
    },

    editItem: function(item) {
      this.get('onEdit')(item);
    },
  }
});
