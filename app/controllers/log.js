import Ember from 'ember';

export default Ember.Controller.extend({
  store: Ember.inject.service(),
  model: []

//   columns: [20, 20, 20, 20, 20],
//   itemHeight: 500,
//   itemWidth: 400,
//   itemSizes: { width: 400, height: 500},
//   itemHeight
//   filteredShips: Ember.computed.filterBy('content', 'member', ),
//   setup: Ember.on('init', function() {
//     this.set('content', this.store.findAll('shipCollection'));
//     this.set('ships', this.store.findAll('ship'));
//   }),
});
