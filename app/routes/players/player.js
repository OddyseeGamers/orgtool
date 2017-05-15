import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;

export default Ember.Route.extend({
//   redirect: function(model, transition) {
//     Ember.Logger.debug("TRANSITION 1", transition.targetName)
//   },

  model: function(params) {
    Ember.Logger.debug("FIND PLAYER", params.player_id);
//     return this.store.findRecord('player', params.player_id); //, {reload: true});

//     return Ember.RSVP.hash({
//       player: this.store.findRecord('player', params.player_id),
//       rewardTypes: this.store.findAll('rewardTypes')
//     return .then(player) {
//     }
    
    var self = this;
    return this.store.findRecord('player', params.player_id).then(function(pl) {
      console.debug("-- RELOAD HELL --", get(pl, "rewards.length"));
      var fetch = {
        rewardType: self.store.findAll('rewardType')
      };
      pl.get("rewards").forEach(function(reward) {
        fetch[get(reward, "id")] = reward.reload();
      });

      console.debug("-- RELOAD HELL --", fetch);
      var all = Ember.RSVP.hash(fetch);
      return all.then(function(done) {
        Ember.Logger.log("-- HELL loaded --");
        return pl;
      });
    });
  },


  afterModel: function(model, transition) {
    this.controllerFor('players.player').set('showDialog', true);
  },

/*
  afterModel: function(model, transition) {
    //this.controllerFor('settings.items').set('itemTypes', this.store.findAll('itemType'));
//     this.controllerFor('players.player').set('showDialog', true);
//     Ember.Logger.debug("what");
//     this.controllerFor('players.player.stats').set("rewardTypes", this.store.findAll('rewardType', {reload: true}));

    console.debug("-- RELOAD HELL --");
//     return model.get("rewards").forEach(function(reward) {
//       return reward.reload().then(function(nrew) {
//         console.debug("  - reload done", get(nrew, "id"), '| name ', get(nrew, "name"), "| level ", get(nrew, "level"), " | type ", get(nrew, "rewardType.id"));

//         var gidx = rt_lookup[get(nrew, "rewardType.id")];
//         var nr = {id: get(nrew, "id"), name: get(nrew, "name"), img: get(nrew, "img"), units: []};
//         group[gidx].rewards.push(nr);
//       });
//     });

  },
  */
//   setupController: function(controller, model) {
//     Ember.Logger.debug("setup player controller after model....");
//     this.controllerFor('players.player').set('showDialog', true);
//     this.controllerFor('players.player.stats').set("rewardTypes", this.store.findAll('rewardType', {reload: true}));

//     Ember.Logger.debug("what");
//     controller.setProperties(model);
//   },

  actions: {
    addHandle: function(player) {
      var handle = this.store.createRecord('handle');
      handle.set('player', player);
      this.controllerFor('players.player').set('currHandle', handle);
      this.controllerFor('players.player').set('showHandleDialog', true);
    },

    editHandle: function(handle) {
      this.controllerFor('players.player').set('currHandle', handle);
      this.controllerFor('players.player').set('showHandleDialog', true);
    },

  }
});

