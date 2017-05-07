import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;

export default Ember.Controller.extend({
  store: Ember.inject.service(),
  session: Ember.inject.service(),
  eventManager: Ember.inject.service('events'),

  currentUnit: null,
  currentChart: { id: 1 },
  currentLevel: 1,

  columns: [50, 50],
  itemHeight: 80,

  setup: Ember.on('init', function() {
    this.get('eventManager').on('addUnit', this.addUnit.bind(this));
    this.get('eventManager').on('addGame', this.addUnit.bind(this));

    this.get('eventManager').on('editUnit', this.editUnit.bind(this));
    this.get('eventManager').on('deleteUnit', this.deleteUnit.bind(this));

    this.get('eventManager').on('setDetails', this.setDetails.bind(this));

//     this.setDetails({ "unitid": 1, "extended": false, "sync": false }); 
  }),

//   sortProperties: ['name'],
//   sortedContent: Ember.computed.sort('allItems', 'sortProperties').property('allItems'),

  sumItems: Ember.computed("sumMembers", function() {
    var items = {};
    var mems = this.get('sumMembers');
    mems.forEach(function(mem) {
      mem.get("items").forEach(function(it) {
        var par = it.get("parent");
        if (items[par.get("id")]) {
          items[par.get("id")].count++;
        } else {
          items[par.get("id")] = { itemType: par, count: 1};
        }
      });
    });

    var output = Object.keys(items).map(function(key) {
       return {type: items[key].itemType, count: items[key].count};
    });
    
    output.sort(function(a, b) {
      var an = a.type.get('name');
      var bn = b.type.get('name');

      if(an < bn) return -1;
      if(an > bn) return 1;
      return 0;
    });

    return output;
  }),

  sumMembers: Ember.computed("currentUnit", function() {
    if (Ember.isEmpty(this.get("currentUnit"))) {
      return [];
    }
    return this.get("currentUnit").get('members');
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
          Ember.Logger.debug("done saving", done);
//           self.set('unit', done);
          self.get('eventManager').trigger('rerender');
          self.transitionToRoute('overview.unit', done.get('id'));
        }).catch(function(err) {
          Ember.Logger.debug("error saving", err);
          unit.deleteRecord();
        });
      });
    });
  },

  editUnit: function(data) {
    this.transitionToRoute('overview.unit', data.id);
  },

  deleteUnit: function(data) {
    var self = this;
    this.store.deleteRecord(data.unit);
    data.unit.save().then(function(nunit) {

      self.get('eventManager').trigger('rerender');
    }).catch(function(err) {
      Ember.Logger.debug("del err", err);
      data.unit.rollback();
      self.get('eventManager').trigger('rerender');
    });
  },


  setDetails: function(data) {
//     Ember.Logger.debug("---- set details");
    var unitId = data.unitid;
    var extended = data.extended;
    var sync = data.sync;

//     if (extended && (!this.get('members') || this.get('members.length') === 0)) {
//       this.set('members', this.store.peekAll('member'));
//     }

    if (unitId !== undefined) {
      var self = this;
      this.get('store').findRecord('unit', unitId).then(function(unit) {
        self.set('currentUnit', unit);
        self.set('extended', extended);
        if (sync) {
          self.set('currentChart', unit);
        }
      }).catch(function(err) {
        Ember.Logger.debug(">>>>  error ", err);
        self.set('currentUnit', 1);
        self.set('currentChart', 1);
      });
    } else {
      this.set('currentUnit', 1);
      this.set('currentChart', 1);
    }

    if(this.get('currentUnit', 1)) {
      this.set('currentLevel', 1);
    } else {
      this.set('currentLevel', 5);
    }
  },
});
