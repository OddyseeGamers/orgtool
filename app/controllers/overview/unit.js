import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;

export default Ember.Controller.extend({
  store: Ember.inject.service(),
  eventManager: Ember.inject.service('events'),
  session: Ember.inject.service('session'),
  loader: Ember.inject.service('loader'),
//   showDialog: true,
//  currShip: null,
 // sortProperties: ['name:asc'],
//  sortedShipModels: Ember.computed.sort('shipModels', 'sortProperties'),
  unit: null,
  showDialog: false,

  actions: {
    submit: function() {
      var unit = get(this, 'unit');
      var self = this;

      self.set('showDialog', false);
//       if (!unit.get('hasDirtyAttributes')) {
//         self.log("done unit " + get(unit, 'id'));
//         self.set('unit', null);
//         self.set('loading', false);
//         return;
//       }

//       console.debug("save", unit.get('hasDirtyAttributes'), " - " , unit.get('type.name'), ' = ', unit.get('type.hasDirtyAttributes') );
      unit.save().then(function(nunit) {
        self.set('unit', null);
        self.set('showDialog', false);
        self.get('eventManager').trigger('rerender');
        self.transitionToRoute('overview');
//         self.store.findAll('unitType').then(function(unitTypes) {
//           self.set('unitTypes', unitTypes);
//         });
      }).catch(function(err) {
        console.debug("save err", err);
        self.set('showDialog',true);
//         unit.rollback();
        self.get('eventManager').trigger('rerender');
      });
    },

    close: function() {
      var unit = get(this, 'unit');
      if (unit.get('hasDirtyAttributes')) {
//         unit.rollbackAttributes();
        unit.reload();
      }
      this.set('showDialog', false);
      this.set('unit', null);
      this.transitionToRoute('overview');
    },

    setType: function(type) {
      var unit = get(this, 'unit');
      unit.set('type', type);
      unit.send('becomeDirty');
    },
  }

});
