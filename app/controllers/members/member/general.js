import Ember from 'ember';
// import Moment from 'moment';

var get = Ember.get;
var set = Ember.set;

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),
  actions: {
    saveAvatar: function() {
      console.debug("save", get(this, "model").get("avatar"));
      return false;
    },
  }
});
