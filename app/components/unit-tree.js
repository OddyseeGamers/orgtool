import Ember from 'ember';

export default Ember.Component.extend({
  showDeitails: null,

  setup: Ember.on('init', function() {
    this.set('showDeitails', true);
  }),


  showUnit: Ember.computed.bool('showDeitails'),

  actions: {
    toggleShow: function() {
      this.set('showDeitails', ! this.get('showDeitails'));
    }
  }

/*
  hideList: null,
  setup: Ember.on('init', function() {
    this.set('hideList', Ember.A());
  }),

  showUnit: function() {
    return this.get('hideList').indexOf(parseInt(this.get('unit.id'))) < 0;
  }.property('hideList.[]'),

  actions: {
    toggleShow: function(unitId) {
      var id = parseInt(unitId);
      var list = this.get('hideList');
      var idx = list.indexOf(id);
      if (idx < 0) {
        list.pushObject(id);
      } else {
        var temp = list.removeAt(idx);
      }
      this.set('hideList', list);
    }
  }
*/
});
