import Ember from 'ember';
import pagedArray from 'ember-cli-pagination/computed/paged-array';

var get = Ember.get;
var set = Ember.set;

export default Ember.Controller.extend({
  store: Ember.inject.service(),
  session: Ember.inject.service(),
  eventManager: Ember.inject.service('events'),
  model: [],
  searchFilter: '',

  filteredContent: Ember.computed.filter('model', function(member, index, array) {
    var searchFilter = this.get('searchFilter');
    if (Ember.isEmpty(searchFilter)) {
      return [];
    } else {
      var regex = new RegExp(searchFilter, 'i');
      return get(member, 'name').match(regex) || get(member, 'handle').match(regex);
    }
  }).property('searchFilter'),


  setup: Ember.on('init', function() {
//     this.get('eventManager').on('resizeMembers', this.resizeMembers.bind(this));
//     $(window).bind('resize', this.resizeMembers.bind(this));
    this.set('searchFilter', '');
  }),

//   willDestroy: function() {
//     $(window).unbind('resize', this.get('resizeMembers'));
//     this.get('eventManager').off('resizeMembers');
//   },

/*
  resizeMembers: function() {
    var div = Ember.$(".member-result");
    var width = div.width();
    var height = div.height();
    var c = height / 47;
    this.set('perPage', Math.floor(c));
  },
*/

  actions: {
    clearFilter: function() {
      this.set('searchFilter', '');
    }
  }

});
