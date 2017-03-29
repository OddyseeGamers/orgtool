import Ember from 'ember';
// import Moment from 'moment';

var get = Ember.get;
var set = Ember.set;
var debug = Ember.Logger.debug;

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),

  rank: Ember.computed.filter('model.memberRewards', function(mr, index, array) {
//       return !chore.done;
//     debug(" - wtf", index, get(get(mr, "reward"), "type").get("id") ,"=", get(get(mr, "reward"), "type").get("name"), "||||", get(get(mr, "reward"), "type").get("id") == 1);
    return get(get(mr, "reward"), "type").get("id") == 1;
  }), //.property('model.memberRewards'),

//   rank: Ember.computed('model', function() {
//     var ret = [];
//     get(this, 'model').get("memberRewards").forEach(function(mr) {
//       if (get(get(mr, "reward"), "type").get("id") == 1) {
//         ret.push(get(mr, "reward"));
//       }
//     });
//     return ret;
//   }).property('model.memberRewards'),
  

  actions: {
    saveAvatar: function() {
      Ember.Logger.debug("save", get(this, "model").get("avatar"));
      return false;
    },
  }
});
