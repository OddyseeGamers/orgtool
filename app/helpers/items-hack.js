import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;

export function itemsHack(params/*, hash*/) {
  if (params.length == 1) {
    params[0].reload();
  }
}

export default Ember.Helper.helper(itemsHack);
