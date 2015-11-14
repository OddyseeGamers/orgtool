import Ember from 'ember';

export default Ember.Controller.extend({
  store: Ember.inject.service(),
  eventManager: Ember.inject.service('events'),
  currentUnit: null,
  units: null,
  members: null,

//   mems: Ember.computed.filterBy('members.[]', 'unit', 5),

  setup: Ember.on('init', function() {
    this.set('units', this.store.findAll('unit'));
    this.set('members', this.store.findAll('member'));

    this.get('eventManager').on('setDetails', this.setDetails.bind(this));
  }),

//   setupMems: Ember.observer('currentUnit', function() {
//     console.debug("current unit changed");
//     this.set('filteredMembers', this.get("members").filterBy("unit", undefined));
//     var mems = this.get('members');
//     console.debug('members changed', mems.get('length'));
//     if (this.get('members.isLoaded')) {
//       console.debug('length:', mems.filterBy('unit', {id: null}).get('length'));
//     }
//   }),

  filteredMembers: Ember.computed.filterBy('members', 'unit.id', undefined),

  /*
  filteredMembers: function() {
      var self = this;
      return this.store.find('unit', 5).then(function(unit) {
//         console.debug("something changed", unit);
        return self.get('members').filterBy('unit', unit);
      });
  }.property('members', 'currentUnit'),
  */

  /*
  setupOrg: Ember.observer('units.@each.typs', function() {
    if (this.get('currentUnit') === null) {
      var org = this.get('units').filterBy('type', 'org');
      if (org.get('length')) {
        this.set('currentUnit', org.objectAt(0));
      }
    }
  }),
  */

  setDetails: function(unitId) {
    if (unitId !== undefined) {
      var unit = this.get('store').find('unit', unitId);
      this.set('currentUnit', unit);
    }
  }
});
