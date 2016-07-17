import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;

export default Ember.Component.extend({
  classNames: ['member-filtered-list'],
  sortProperties: ['numericID'],
  details: false,

  filteredContent: Ember.computed.filter('members', function(member, index, array) {
    var searchFilter = this.get('searchFilter');
    var res = []
    if (!Ember.isEmpty(searchFilter)) {
      var regex = new RegExp(searchFilter, 'i');
      var handle = get(member, 'handle') ? get(member, 'handle') : get(member, 'name');
      res = get(member, 'name').match(regex) || handle.match(regex);
    }
    return res;
  }).property('searchFilter'),

  sortedContent: Ember.computed.sort('filteredContent', 'sortProperties').property('filteredContent'),

  columns: [100],
  itemHeight: 39,

  actions: {
    clearFilter: function() {
      this.set('searchFilter', '');
    }
  }
});
