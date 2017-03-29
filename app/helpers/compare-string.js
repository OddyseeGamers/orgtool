import Ember from 'ember';

export function compareString(params/*, hash*/) {
  if (params.length == 2) {
    if (Ember.isEmpty(params[0]) || Ember.isEmpty(params[1])) {
      return ""; //params[1];
    }
    Ember.Logger.debug(">>> compare", '"' + params[0] + '"', "==", '"' + params[1] + '"', (params[0] == params[1]));
    if (params[0].toLowerCase() != params[1].toLowerCase()) {
      return params[1];
    }
  }
  return "";
}

export default Ember.Helper.helper(compareString);
