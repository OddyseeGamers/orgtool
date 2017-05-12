import Ember from 'ember';
// import Moment from 'moment';

var get = Ember.get;
var set = Ember.set;

export default Ember.Controller.extend({
  store: Ember.inject.service(),
  eventManager: Ember.inject.service('events'),
  session: Ember.inject.service('session'),
//   showDialog: false,
//   showItemDialog: false,
//   sortProperties: ['name:asc'],
//   sortedShipModels: Ember.computed.sort('shipModels', 'sortProperties'),

  actions: {
  }
});
