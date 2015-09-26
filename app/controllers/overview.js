import Ember from 'ember';

export default Ember.Controller.extend({
  store: Ember.inject.service(),
  eventManager: Ember.inject.service('events'),
  showBreadPath: true,
  currentUnit: null,
  content: null,

  setup: Ember.on('init', function() {
//     var org = null;
//     var data = this.get('content');
//     console.debug("DATA>", data);
    /*
    for (var i = 0; i < data.get('length') && !org; i++) {
      var el = data.objectAt(i);
      if (el.get('type') === "org") {
        org = el;
      }
    };
*/

    this.set('content', this.store.findAll('unit'));
    this.set('members', this.store.findAll('member'));
    this.get('eventManager').on('setDetails', this.setDetails.bind(this));
  }),

  duration: function() {
    console.debug("ciontent changed");
  }.property('content'),

  setDetails: function(unitId) {
    if (unitId !== undefined) {
      var unit = this.get('store').find('unit', unitId);
      this.set('currentUnit', unit);
    }
  }
});
