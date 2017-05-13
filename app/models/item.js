import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr(),
  description: DS.attr(),
  img: DS.attr(),

  template: DS.belongsTo('template', { inverse: 'items', async: true }),

  player: DS.belongsTo('player'), //, { inverse: 'items', async: true }),

//   unit_id:  DS.belongsTo('unit', { inverse: 'items', async: true }),

  itemProps: DS.hasMany('itemProp', { async: true }),

  hidden: DS.attr(),
  available: DS.attr(),
});
