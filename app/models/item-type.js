import DS from 'ember-data';

export default DS.Model.extend({
  typeName: DS.attr(),
  name: DS.attr(),
  description: DS.attr(),
  img: DS.attr(),
  permissions: DS.attr(),
  items: DS.hasMany('item', { async: true })

//   shipCollection: DS.hasMany('shipCollection', { async: true}),
//   type: DS.belongsTo('shipType', { async: true }),
//   roles: DS.hasMany('shipRole', { async: true })
});
