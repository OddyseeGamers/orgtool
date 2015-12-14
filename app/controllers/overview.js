import Ember from 'ember';
import pagedArray from 'ember-cli-pagination/computed/paged-array';

var get = Ember.get;
var set = Ember.set;

export default Ember.Controller.extend({
  store: Ember.inject.service(),
  eventManager: Ember.inject.service('events'),
  currentUnit: null,
  units: null,
  members: [],


  // setup our query params
  queryParams: ["page", "perPage"],

  // set default values, can cause problems if left out
  // if value matches default, it won't display in the URL
  page: 1,
  perPage: 15,
  currentPage: 1,

  // only want records that are not completed
//   filteredContent: Ember.computed.filterBy('content', 'isCompleted', false),
//   filteredContent: Ember.computed.filterBy('members', 'units.length', 0),

  // can be called anything, I've called it pagedContent
  // remember to iterate over pagedContent in your template
//   pagedContent: pagedArray('filteredContent'),
//   pagedContent: membersEmber.computed.filterBy('members', 'units.length', 0),
  pagedContent: pagedArray('members'), //, {pageBinding: "page", perPageBinding: "perPage"}),

  // binding the property on the paged array
  // to the query params on the controller
  pageBinding: "pagedContent.page",
  perPageBinding: "pagedContent.perPage",
  totalPagesBinding: "pagedContent.totalPages",
//   currentPageBinding: "pagedContent.currentPage",


  setup: Ember.on('init', function() {
    this.get('eventManager').on('setDetails', this.setDetails.bind(this));
    
  }),

//   filteredMembers: Ember.computed.filterBy('members', 'units.length', 0),

  setDetails: function(unitId) {

//       console.debug(">> set detals");
    if (!this.get('members') || this.get('members.length') === 0) {
//       var mems =  this.store.peekAll('member');
//       console.debug(">> members", get(mems, 'length'));
      this.set('members', this.store.peekAll('member'));
    }

    if (unitId !== undefined) {
      var self = this;
      this.get('store').findRecord('unit', unitId).then(function(unit) {
        self.set('currentUnit', unit);
      }).catch(function(err) {
        self.set('currentUnit', null);
      });
    } else {
      this.set('currentUnit', null);
    }

//     if (!this.get('members')) {
//       var self = this;
//       var localPosts = store.peekAll('post');

//       var mems =  this.store.peekAll('member');
//       console.debug(">> members", get(mems, 'length'));
//       this.set('members', this.store.peekAll('member'));
//       this.set('members', this.store.findAll('member').then(function(members) {
//         self.set('pagedContent', pagedArray('members', {pageBinding: "page", perPageBinding: "perPage"}));
//         return members;
//       })
//       );
//     }
  }
});
