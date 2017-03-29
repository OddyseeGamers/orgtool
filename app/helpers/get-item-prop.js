import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;

export function hexToRgba(params/*, hash*/) {
  var result = "";
  if (params.length != 2) {
    return result;
  }

  var item = params[0];
  var propName = params[1];
  var ips = get(item, "itemProps");

  if (Ember.isEmpty(ips)) {
    return result;
  }

  for (var i = 0; i < get(ips, "length") && Ember.isEmpty(result); i++) {
//     if (get(ips.objectAt(i), "prop") && get(get(ips.objectAt(i), "prop"), "name") === propName) {
    if (get(get(ips.objectAt(i), "prop"), "name") === propName) {
      result = get(get(ips.objectAt(i), "prop"), "value");
    }
  }
//   Ember.Logger.debug(" res:", propName,":", result);
  return result;
}

export default Ember.Helper.helper(hexToRgba);
