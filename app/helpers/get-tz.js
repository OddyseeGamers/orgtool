/*
import Ember from 'ember';
import Moment from 'moment';

export function getTZ(params) {
  if (params.length != 1) {
    return "";
  }

  var num = params[0];
//   console.debug("time zone", num, ":", Moment.tz(num).format('Z'));
  return Moment.tz(num).format('Z') + " " + num + " | " + moment().utcOffset(Moment.tz(num).format('Z'));
}

export default Ember.Helper.helper(getTZ);
*/
