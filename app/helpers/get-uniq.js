import Ember from 'ember';

export function getUniq(params/*, hash*/) {
  if (params.length != 2) {
    return "";
  }

  var item = params[0];
  var prop = params[1];
  
  var result = [];
  if (Ember.get(item, "length") > 0) {
    for (var i = 0; i < Ember.get(item, "length"); i++) {
      if (item.objectAt(i).get(prop) && $.inArray(item.objectAt(i).get(prop), result) < 0) {
        result.push(item.objectAt(i).get(prop));
      }
    }
  }

  return result.join(", ");
}

export default Ember.Helper.helper(getUniq);
