import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr(),
  desc: DS.attr(),
  ships: DS.hasMany('ships', { async: true})
});

