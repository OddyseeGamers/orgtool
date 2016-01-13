import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr(),
  description: DS.attr(),
  img: DS.attr(),
  shipModel: DS.hasMany('shipModel', { async: true}),
});

