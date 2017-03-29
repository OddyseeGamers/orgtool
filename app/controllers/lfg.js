import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;

export default Ember.Controller.extend({
  session: Ember.inject.service(),

  actions: {
    createEvent: function() {
        Ember.Logger.debug("create event");
        var lfg = this.get('store').createRecord('lfg');
        var self = this;
        lfg.save().then(function(done) {
          Ember.Logger.debug("create event done", done);
        }).catch(function(err) {
          Ember.Logger.debug("create event failed", err);
        });
    },
  }

});
