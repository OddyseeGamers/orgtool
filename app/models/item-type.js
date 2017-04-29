import DS from 'ember-data';

export default DS.Model.extend({
  typeName: DS.attr(),
  name: DS.attr(),
  description: DS.attr(),
  img: DS.attr(),
  permissions: DS.attr(),
  items: DS.hasMany('item', { async: true }),
//   parent: DS.belongsTo('itemType', { inverse: 'item_types', async: true }),
  parent: DS.belongsTo('itemType', { inverse: 'types', async: true }),
  types: DS.hasMany('itemType', { inverse: 'parent', async: true })

//   shipCollection: DS.hasMany('shipCollection', { async: true}),
//   type: DS.belongsTo('shipType', { async: true }),
//   roles: DS.hasMany('shipRole', { async: true })
});
