import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;

export default Ember.Controller.extend({
  sortProperties: ['numericID'],
  store: Ember.inject.service(),
  loader: Ember.inject.service(),
  session: Ember.inject.service(),
  eventManager: Ember.inject.service('events'),
  details: false,

  columns: [100],
  itemHeight: 42,

  setup: Ember.on('init', function() {
//     this.get('eventManager').on('createMember', this.createMember.bind(this));
    console.debug("or get data here..");
    this.get('eventManager').on('saveMember', this.saveMember.bind(this));
    this.get('eventManager').on('deleteMember', this.deleteMember.bind(this));

    var self = this;
    console.debug("get data");
    get(this, 'store').findRecord('unit', 1).then(function(unit) {
      self.set('rootUnit', unit);
    });

    get(this, 'store').findAll('member').then(function(members) {
      self.set('members', members);
    });
  }),


/////////////////////////////////////
//
//
  hasParent: function(id, unit) {
    try {
//       if (unit.get("id") == 102) {
        console.debug("wtf now again?", unit.get("id"), " - ", unit.get("parent"), " = ", (unit.get("parent") ? unit.get("parent").get("isLoaded") : "-")); 
//       }
      return (unit && unit.get("id") == id) || (unit && unit.get('parent') && this.hasParent(id, unit.get('parent')));
    } catch(err) {
        console.debug("error", err);
    }
    return false;
  },


  filteredContent: Ember.computed.filter('members', function(member, index, array) {
    var searchFilter = this.get('searchFilter');
    var unitFilter = this.get('unitFilter');
    var res = []

    if (Ember.isEmpty(searchFilter) && Ember.isEmpty(unitFilter)) {
      return true;
    }

    if (!Ember.isEmpty(searchFilter)) {
      var regex = new RegExp(searchFilter, 'i');
      var handle = get(member, 'handle') ? get(member, 'handle') : get(member, 'name');
      res = get(member, 'name').match(regex) || handle.match(regex);

      if (Ember.isEmpty(res)) {
        return false;
      }
    }

    if (!Ember.isEmpty(unitFilter)) {
      var self = this;
      res = member.get('memberUnits').filter(function(item, index, enumerable){
        return self.hasParent(unitFilter.get("id"), item.get('unit'));
      });
      if (Ember.isEmpty(res)) {
        return false;
      }
    }

    return res;
  }).property('searchFilter', 'members.length', 'unitFilter'),

  sortedContent: Ember.computed.sort('filteredContent', 'sortProperties').property('filteredContent'),



//////////////////////////////////////


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

    setUnitFilter: function(data) {
//       console.debug("set ", data);
      set(this, 'unitFilter', data);
    },

    clearFilter: function() {
//       console.debug("clear");
      this.set('searchFilter', '');
    },

  }

});
