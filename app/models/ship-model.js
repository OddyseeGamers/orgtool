import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr(),
  img: DS.attr(),
  crew: DS.attr(),
  length: DS.attr(),
  mass: DS.attr(),
  updated_at:  DS.attr('date'),
  manufacturer: DS.belongsTo('shipManufacturer', { async: true }),

  type: DS.attr(),
  roles: DS.attr(),
  ships: DS.hasMany('ships', { async: true}),
  class: DS.belongsTo('shipClass', { async: true}),
//   type: DS.belongsTo('shipType', { async: true }),
//   roles: DS.hasMany('shipRole', { async: true })
});
