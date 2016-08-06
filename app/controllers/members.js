import Ember from 'ember';
import pagedArray from 'ember-cli-pagination/computed/paged-array';

var get = Ember.get;
var set = Ember.set;

export default Ember.Controller.extend({
  store: Ember.inject.service(),
  session: Ember.inject.service(),
  eventManager: Ember.inject.service('events'),


  setup: Ember.on('init', function() {
//     this.get('eventManager').on('createMember', this.createMember.bind(this));
    this.get('eventManager').on('saveMember', this.saveMember.bind(this));
    this.get('eventManager').on('deleteMember', this.deleteMember.bind(this));
  }),

  jump: function(memberid) {
  },


    saveMember: function(member) {
        console.debug("save member", member.get('id'));
      member.save().then(function(mem) {
        console.debug("save ok", mem);
      }).catch(function(err) {
        console.debug("save not ok", err);
      });
    },

  deleteMember: function(member) {
      if (!member) {
        return;
      }
      console.debug("delete user");
//       member.deleteRecord('member'); //this.store.createRecord('member');
      var self = this;
      member.destroyRecord().then(function(done) {
        self.transitionToRoute('members');
      }).catch(function(err) {
        console.debug("delete  user", err);
      });
//       this.set('searchFilter', '');

  },


//   model: [],
//   searchFilter: '',
//    

//   filteredContent: Ember.computed.filter('models.members', function(member, index, array) {
//     var searchFilter = this.get('searchFilter');
//     var res = []
//     if (!Ember.isEmpty(searchFilter)) {
//       var regex = new RegExp(searchFilter, 'i');
//       var handle = get(member, 'handle') ? get(member, 'handle') : get(member, 'name');
//       res = get(member, 'name').match(regex) || handle.match(regex);
//     }
//     return res;
//   }).property('searchFilter'),

//   columns: [100],
//   itemHeight: 50,

  actions: {
    createMember: function() {
        console.debug("create user");
        var member = this.get('store').createRecord('member'); //this.store.createRecord('member');
        var self = this;
        member.save().then(function(done) {
          self.transitionToRoute('members.member', done.get('id'));
        }).catch(function(err) {
          console.debug("create user", err);
        });
  //       this.set('searchFilter', '');

    },
//     clearFilter: function() {
//       this.set('searchFilter', '');
//     }
  }

});
