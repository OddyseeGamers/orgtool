import Ember from 'ember';

export default Ember.Controller.extend({
  store: Ember.inject.service(),
  eventManager: Ember.inject.service('events'),
  showBreadPath: true,

  setup: Ember.on('init', function() {
    console.debug('>>>> init');
    this.get('eventManager').on('setDetails', this.setDetails);
  }),

  setDetails: function(args) {
    console.debug('set details', args);
  }
});
