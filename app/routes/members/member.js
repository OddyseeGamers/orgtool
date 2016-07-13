import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;

export default Ember.Route.extend({
  eventManager: Ember.inject.service('events'),

  loader: Ember.inject.service(),

//   beforeModel: function(transition) {
//     console.debug(">>> load all now <<<");
//     this.get('loader').loadThemAll();
//   },

//   setupController(controller, model) {
//     Ember.set(controller, 'models', this.get('loader', 'models'));
//     Ember.set(controller, 'models', this.get('loader', 'models'));
//   },

  model: function(params) {
//     Ember.set(controller, 'models', this.get('loader', 'models.members').find(params.member_id));
    return this.store.find('member', params.member_id);
  },

/*
  afterModel: function(model, transition) {
    var self = this;
    var prom = Ember.RSVP.hash({
      shipManufacturer: this.store.findAll('shipManufacturer').then(function(shipManufacturer) {
        self.get('eventManager').trigger('log', "shipManufacturer assignments fetched");
        self.controllerFor('members.member').set('shipManufacturer', shipManufacturer);
      }),
      shipModel: this.store.findAll('shipModel').then(function(ships) {
        self.get('eventManager').trigger('log', "shipModel fetched");
        self.controllerFor('members.member').set('shipModels', ships);
      }),
    });

    prom.then(function(done) {
      self.get('eventManager').trigger('success', 'loading done');
    });
  },
  */
});

