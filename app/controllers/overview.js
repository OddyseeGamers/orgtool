import Ember from 'ember';

export default Ember.Controller.extend({
  store: Ember.inject.service(),
  eventManager: Ember.inject.service('events'),
  showBreadPath: true,
  currentUnit: null,

  setup: Ember.on('init', function() {
    this.get('eventManager').on('setDetails', this.setDetails.bind(this));
  }),

  setDetails: function(unitId) {
    if (unitId !== undefined) {
      var unit = this.get('store').find('unit', unitId);
      this.set('currentUnit', unit);
    }
  }
});
