import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr(),
  description: DS.attr(),
  img: DS.attr(),
  color: DS.attr(),

  type_id: DS.belongsTo('unitType', { async: true }),
  unit_id: DS.belongsTo('unit', { inverse: 'units', async: true }),

  units: DS.hasMany('unit', { inverse: 'unit_id', async: true }),
  memberUnits: DS.hasMany('memberUnit', { async: true })
});
