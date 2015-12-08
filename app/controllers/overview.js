import Ember from 'ember';

export default Ember.Controller.extend({
  store: Ember.inject.service(),
  eventManager: Ember.inject.service('events'),
  currentUnit: null,
  units: null,
  members: null,

  setup: Ember.on('init', function() {
    this.get('eventManager').on('setDetails', this.setDetails.bind(this));
  }),

  filteredMembers: Ember.computed.filterBy('members', 'units.length', 0),

  setDetails: function(unitId) {
    if (unitId !== undefined) {
      var self = this;
      this.get('store').findRecord('unit', unitId).then(function(unit) {
        self.set('currentUnit', unit);
      }).catch(function(err) {
        self.set('currentUnit', null);
      });
    } else {
      this.set('currentUnit', null);
    }

//     if (!this.get('members')) {
//       this.set('members', this.store.findAll('member'));
//     }
  }
});
