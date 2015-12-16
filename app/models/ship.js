import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr(),
  model: DS.belongsTo('shipModel', { async: true }),
  member: DS.belongsTo('member', { async: true }),
//   shipCollection: DS.hasMany('shipCollection', { async: true}),
//   type: DS.belongsTo('shipType', { async: true }),
//   roles: DS.hasMany('shipRole', { async: true })
});
