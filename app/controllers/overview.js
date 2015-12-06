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

  filteredMembers: Ember.computed.filterBy('members', 'unit.id', undefined),

  setDetails: function(unitId) {
    if (unitId !== undefined) {
      var unit = this.get('store').find('unit', unitId);
      this.set('currentUnit', unit);
    } else {
      this.set('currentUnit', null);
    }

    if (!this.get('members')) {
      this.set('members', this.store.findAll('member'));
    }
  }
});
