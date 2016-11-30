import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr(),
  description: DS.attr(),
  img: DS.attr(),
  value: DS.attr(),
  unit: DS.attr(),
  updated_at: DS.attr(),
//   type: DS.belongsTo('propType', { inverse: 'prop', async: true }),
  value: DS.attr(),
//   item: DS.belongsTo('item', { inverse: 'prop', async: true }),
//   itemProps: DS.hasMany('itemProp', { async: true })


//   hidden: DS.attr('boolean'),
//   available: DS.attr('boolean'),
//   model: DS.belongsTo('shipModel', { async: true }),
//   shipCollection: DS.hasMany('shipCollection', { async: true}),
//   type: DS.belongsTo('shipType', { async: true }),
//   roles: DS.hasMany('shipRole', { async: true })
});
