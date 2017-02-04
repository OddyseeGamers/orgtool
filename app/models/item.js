import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr(),
  description: DS.attr(),
  img: DS.attr(),
  type: DS.belongsTo('itemType', { async: true }),
  parent: DS.belongsTo('item', { inverse: 'items', async: true }),
  member: DS.belongsTo('member', { inverse: 'items', async: true }),
  unit: DS.attr(),
  itemProps: DS.hasMany('itemProp', { async: true }),
  items: DS.hasMany('item', { inverse: 'parent', async: true }),

  hidden: DS.attr(),
  available: DS.attr(),
});
