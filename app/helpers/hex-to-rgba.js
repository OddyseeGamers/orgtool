import Ember from 'ember';

export function hexToRgba(params/*, hash*/) {
  var result = "";
  var hex;
  if (params.length > 0) {
    hex = params[0];
  } else {
    return result;
  }

  var alpha = 255;
  if (params.length == 2) {
    alpha = params[1];
  }


  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function(m, r, g, b) {
      return r + r + g + g + b + b;
  });

  result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    return Ember.String.htmlSafe(result);
  }

  return Ember.String.htmlSafe("rgba(" + parseInt(result[1], 16).toString() + ", " + parseInt(result[2], 16).toString() + ", " + parseInt(result[3], 16).toString() + ", " + alpha.toString() + ")");
}

export default Ember.Helper.helper(hexToRgba);
