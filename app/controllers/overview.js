import Ember from 'ember';
import pagedArray from 'ember-cli-pagination/computed/paged-array';

var get = Ember.get;
var set = Ember.set;

export default Ember.Controller.extend({
  store: Ember.inject.service(),
  session: Ember.inject.service(),
  eventManager: Ember.inject.service('events'),
  currentUnit: null,
  currentChart: null,
//   units: [],
//   model: [],
//   members: [],
  extended: false,
  dialog: false,
  orgType: null,
  temp: Ember.computed.not('extended'),
  showGameEdit: Ember.computed.and('temp', 'session.isAdmin'),
  searchFilter: '',
//    

  filteredContent: Ember.computed.filter('models.members', function(member, index, array) {
    var searchFilter = this.get('searchFilter');
    var res = []
    if (!Ember.isEmpty(searchFilter)) {
      var regex = new RegExp(searchFilter, 'i');
      var handle = get(member, 'handle') ? get(member, 'handle') : get(member, 'name');
      res = get(member, 'name').match(regex) || handle.match(regex);
    }
    return res;
  }).property('searchFilter'),

  columns: [100],
  itemHeight: 40,

  setup: Ember.on('init', function() {
    this.get('eventManager').on('setDetails', this.setDetails.bind(this));
  }),


  setDetails: function(data) {
    console.debug("---- set details");
    var unitId = data.unitid;
    var extended = data.extended;
    var sync = data.sync;

    if (extended && (!this.get('members') || this.get('members.length') === 0)) {
      this.set('members', this.store.peekAll('member'));
    }

    if (unitId !== undefined) {
      var self = this;
      this.get('store').findRecord('unit', unitId).then(function(unit) {
        self.set('currentUnit', unit);
        self.set('extended', extended);
        if (sync) {
          self.set('currentChart', unit);
        }
      }).catch(function(err) {
        self.set('currentUnit', 1);
        this.set('currentChart', 1);
      });
    } else {
      this.set('currentUnit', 1);
      this.set('currentChart', 1);
    }
  },
//   actions: {
//     clearFilter: function() {
//       this.set('searchFilter', '');
//     }
//   }
});
