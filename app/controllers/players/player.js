import Ember from 'ember';
// import Moment from 'moment';

var get = Ember.get;
var set = Ember.set;

export default Ember.Controller.extend({
  store: Ember.inject.service(),
  eventManager: Ember.inject.service('events'),
  session: Ember.inject.service('session'),
  showDialog: true,

  actions: {
    saveAvatar: function() {
    },

    saveMember: function(player) {
      this.get('eventManager').trigger('saveMember', player);

//         Ember.Logger.debug("save player", player.get('id'));

      player.save().then(function(mem) {
        Ember.Logger.debug("save ok", mem);
      }).catch(function(err) {
        Ember.Logger.debug("save not ok", err);
      });
    },

    deleteMember: function(player) {
//       this.get('eventManager').trigger('deleteMember', player);
//
      Ember.Logger.debug("delete user now", player);
      set(this, "msg", { "type": "delete", "item": player, "title": "Delete Member!", "content": "Do you really want to delete player " + player.get("id") + " | " + player.get("name") + "?" });
      set(this, "showConfirmDialog", true);

    },

    onConfirmed: function(msg) {
      Ember.Logger.debug("on confirm del mem", msg, " - ", get(msg, "item"));
      if (!msg || !msg.item) {
        return;
      }
      Ember.Logger.debug("delete user");
//       player.deleteRecord('player'); //this.store.createRecord('player');
      var self = this;
      msg.item.destroyRecord().then(function(done) {
        set(self, "showConfirmDialog", false);
        self.transitionToRoute('players');
      }).catch(function(err) {
        Ember.Logger.debug("delete  user", err);
      });
    },

    close: function() {
      set(self, "showmDialog", false);
      this.transitionToRoute('players');
    },
  }

});
