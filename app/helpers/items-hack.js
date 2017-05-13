import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;

export function itemsHack(params/*, hash*/) {
  if (params.length == 1 && !Ember.isEmpty(params[0])) {
    var typename = get(params[0], 'constructor.modelName');
    if (typename == "item" || typename == "player") {
      params[0].reload();
    }
  }
}

export default Ember.Helper.helper(itemsHack);
