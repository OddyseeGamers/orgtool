import Ember from 'ember';
import pagedArray from 'ember-cli-pagination/computed/paged-array';

var get = Ember.get;
var set = Ember.set;

export default Ember.Controller.extend({
  store: Ember.inject.service(),
  session: Ember.inject.service(),
  eventManager: Ember.inject.service('events'),
//   model: [],
  searchFilter: '',
   

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
  itemHeight: 50,

  actions: {
    clearFilter: function() {
      this.set('searchFilter', '');
    }
  }

});
