import Ember from 'ember';
import pagedArray from 'ember-cli-pagination/computed/paged-array';

var get = Ember.get;
var set = Ember.set;

export default Ember.Controller.extend({
  store: Ember.inject.service(),
  eventManager: Ember.inject.service('events'),

  // setup our query params
//   queryParams: ["page", "perPage"],

  // set default values, can cause problems if left out
  // if value matches default, it won't display in the URL
  model: [],
  page: 1,
  perPage: 10,
//   totalPages: 1,
  currentPage: 1,


/*
  filteredContent: Ember.computed.filter('model', function(member){
      var searchFilter = this.get('searchFilter');
      var regex = new RegExp(searchFilter, 'i');
      console.debug("search", get(member, 'name'));
      return get(member, 'name').match(regex);
  }).property('searchFilter'),
  */
  searchFilter: '',

  // only want records that are not completed
//   filteredContent: Ember.computed.match('model.name', /^.+@.+\..+$/) Ember.computed.filterBy('content', 'isCompleted', false),
//   filteredContent: Ember.computed.filterBy('members', 'units.length', 0),
//   filteredMembers: Ember.computed.filterBy('members', 'units.length', 0),

  // can be called anything, I've called it pagedContent
  // remember to iterate over pagedContent in your template
//   pagedContent: pagedArray('filteredContent'),
//   pagedContent: membersEmber.computed.filterBy('members', 'units.length', 0),
//   pagedContent: pagedArray('model'), //, {pageBinding: "page", perPageBinding: "perPage"}),

  pagedContent: pagedArray('model', {pageBinding: "page", perPageBinding: "perPage"}),
//   pagedContent: pagedArray('filteredContent', {pageBinding: "page", perPageBinding: "perPage"}),
  // binding the property on the paged array
  // to the query params on the controller
//   pageBinding: "pagedContent.page",
//   perPageBinding: "pagedContent.perPage",
  totalPagesBinding: "pagedContent.totalPages",
//   currentPageBinding: "pagedContent.currentPage",

  setup: Ember.on('init', function() {
//     console.debug("init members...");
    this.get('eventManager').on('resizeMembers', this.resizeMembers.bind(this));
    $(window).bind('resize', this.resizeMembers.bind(this));
  }),

  willDestroy: function() {
    console.debug("destroy");
    $(window).unbind('resize', this.get('resizeMembers'));
    this.get('eventManager').off('resizeMembers');
  },

  resizeMembers: function() {
    var div = Ember.$(".member-result");
    var width = div.width();
    var height = div.height();
    var c = height / 47;
    this.set('perPage', Math.floor(c));
  },

});
