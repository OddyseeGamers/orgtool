import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;

export default Ember.Component.extend({
  classNames: ['member-filtered-list'],
  details: true,

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

  columns: [100],
  itemHeight: 50,


//   setup: Ember.on('didInsertElement', function() {
//     console.debug("setup member list", this.get("members"));
//   }),

  actions: {

    clearFilter: function() {
      this.set('searchFilter', '');
    }
  }
});
