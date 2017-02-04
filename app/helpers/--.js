import Ember from 'ember';

export function decrement(params/*, hash*/) {
  if (params.length != 1) {
    return "";
  }

  var val = params[0];
  if (val !== null) {
    val -= 1;
  }
  return val;
}

export default Ember.Helper.helper(decrement);
