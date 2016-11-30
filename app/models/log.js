import DS from 'ember-data';

export default DS.Model.extend({
  timestamp: DS.attr(),
  comp: DS.attr(),
  msg: DS.attr()
});
