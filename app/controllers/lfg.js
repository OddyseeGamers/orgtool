import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;

export default Ember.Controller.extend({
  session: Ember.inject.service(),

  actions: {
    createEvent: function() {
        console.debug("create event");
        var lfg = this.get('store').createRecord('lfg');
        var self = this;
        lfg.save().then(function(done) {
          console.debug("create event done", done);
        }).catch(function(err) {
          console.debug("create event failed", err);
        });
    },
  }

});
