import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr(),
  description: DS.attr(),
  img: DS.attr(),
  ordering: DS.attr(),
  units: DS.hasMany('units', { async: true })
});

