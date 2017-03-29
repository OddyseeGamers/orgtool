import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;

export default Ember.Controller.extend({
  sortProperties: ['numericID'],
  store: Ember.inject.service(),
  session: Ember.inject.service(),
  eventManager: Ember.inject.service('events'),
  details: false,

  columns: [100],
  itemHeight: 42,

  setup: Ember.on('init', function() {
//     this.get('eventManager').on('createMember', this.createMember.bind(this));
    this.get('eventManager').on('saveMember', this.saveMember.bind(this));
    this.get('eventManager').on('deleteMember', this.deleteMember.bind(this));

    var self = this;
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
//         Ember.Logger.debug("wtf now again?", unit.get("id"), " - ", unit.get("parent"), " = ", (unit.get("parent") ? unit.get("parent").get("isLoaded") : "-")); 
//       }
      return (unit && unit.get("id") == id) || (unit && unit.get('parent') && this.hasParent(id, unit.get('parent')));
    } catch(err) {
        Ember.Logger.debug("error", err);
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

      if (get(member, "name").match(regex)) {
        return true;
      }

      var handles;
      var all = get(member, 'handles');
      for (var i = 0; i < get(all, 'length'); i++) {
        if (all.objectAt(i).get("handle").match(regex)) {
          return true;
        }
      }

      return false;
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
    Ember.Logger.debug("save member", member.get('id'));
    member.save().then(function(mem) {
      Ember.Logger.debug("save ok", mem);
    }).catch(function(err) {
      Ember.Logger.debug("save not ok", err);
    });
  },

  deleteMember: function(member) {
      if (!member) {
        return;
      }
      Ember.Logger.debug("delete user");
//       member.deleteRecord('member'); //this.store.createRecord('member');
      var self = this;
      member.destroyRecord().then(function(done) {
        self.transitionToRoute('members');
      }).catch(function(err) {
        Ember.Logger.debug("delete  user", err);
      });
//       this.set('searchFilter', '');

  },


  actions: {
    createMember: function() {
        Ember.Logger.debug("create user");
        var member = this.get('store').createRecord('member'); //this.store.createRecord('member');
        var self = this;
        member.save().then(function(done) {
          self.transitionToRoute('members.member', done.get('id'));
        }).catch(function(err) {
          Ember.Logger.debug("create user", err);
        });
  //       this.set('searchFilter', '');

    },

    setUnitFilter: function(data) {
//       Ember.Logger.debug("set ", data);
      set(this, 'unitFilter', data);
    },

    clearFilter: function() {
//       Ember.Logger.debug("clear");
      this.set('searchFilter', '');
    },

  }

});
