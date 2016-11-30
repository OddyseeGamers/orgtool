import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr(),
  model: DS.belongsTo('shipModel', { async: true }),
  member: DS.belongsTo('member', { inverse: 'ships', async: true }),
  hidden: DS.attr('boolean'),
  available: DS.attr('boolean'),
//   shipCollection: DS.hasMany('shipCollection', { async: true}),
//   type: DS.belongsTo('shipType', { async: true }),
//   roles: DS.hasMany('shipRole', { async: true })
});
