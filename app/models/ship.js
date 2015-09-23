import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr(),
  manufacturer: DS.attr(),
  type: DS.attr(),
});
