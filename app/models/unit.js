import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr(),
  description: DS.attr(),
  img: DS.attr(),
  color: DS.attr(),

  type: DS.belongsTo('unitType', { async: true }),
  parent: DS.belongsTo('unit', { inverse: 'units', async: false }),

  units: DS.hasMany('unit', { inverse: 'parent', async: false }),
  memberUnits: DS.hasMany('memberUnit', { async: true })
});

