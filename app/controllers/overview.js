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
//   extended: false,
//   orgType: null,
//   temp: Ember.computed.not('extended'),
//   showGameEdit: Ember.computed.and('temp', 'session.isAdmin'),
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
//   itemHeight: 40,

  setup: Ember.on('init', function() {
    this.get('eventManager').on('addUnit', this.addUnit.bind(this));
    this.get('eventManager').on('addGame', this.addUnit.bind(this));

    this.get('eventManager').on('editUnit', this.editUnit.bind(this));
    this.get('eventManager').on('deleteUnit', this.deleteUnit.bind(this));

    this.get('eventManager').on('setDetails', this.setDetails.bind(this));
  }),

  addUnit: function(data) {
    var self = this;
    this.store.findRecord('unit', data.id).then(function (punit) {
      self.store.findRecord('unitType', data.unitType).then(function (unitType) {
        var unit = self.store.createRecord('unit');
        unit.set('type', unitType);
        set(unit, 'parent', punit);
        get(punit, 'units').pushObject(unit);

        unit.save().then(function(done) {
          console.debug("done saving", done);
//           self.set('unit', done);
          self.get('eventManager').trigger('rerender');
          self.transitionToRoute('overview.unit', done.get('id'));
        }).catch(function(err) {
          console.debug("error saving", err);
          unit.deleteRecord();
        });


//           self.set('showDialog', true);
  //       self.get('eventManager').trigger('rerender');
//         self.set('loading', false);
      });
    });
  },

  editUnit: function(data) {
//     console.debug("WTF");
//     if (data.id === get(this, "unit.id")) {
//       this.get('target.router').refresh();
//     } else {
      this.transitionToRoute('overview.unit', data.id);
//     }

//     this.log('edit unit ' + data.id);
//     var self = this;
//     this.store.findRecord('unit', data.id).then(function (unit) {
//       self.set('unit', data.unit);
//       self.set('showDialog', true);
//     });

  },

  deleteUnit: function(data) {
    var self = this;
    this.store.deleteRecord(data.unit);
    data.unit.save().then(function(nunit) {
      self.get('eventManager').trigger('rerender');
    }).catch(function(err) {
      console.debug("del err", err);
      data.unit.rollback();
      self.get('eventManager').trigger('rerender');
    });
  },


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
