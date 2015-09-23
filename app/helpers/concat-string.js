import Ember from 'ember';

export function concatString(params/*, hash*/) {
  var str = "";
  params.forEach(function(arg) {
    str += arg;
  });
  return str;
}

export default Ember.Helper.helper(concatString);
