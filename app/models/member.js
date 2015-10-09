import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr(),
  handle: DS.attr(),
  rank: DS.attr(),
  role: DS.attr(),
  avatar: DS.attr(),
  certs: DS.attr(),
  position: DS.attr(),
  badges: DS.hasMany('badge', { async: true}),
  achievements: DS.attr(),
  shipCollection: DS.hasMany('shipCollection', { async: true}),
  unit: DS.belongsTo('unit', { inverse: 'pilots', async: true }),
  leader: DS.belongsTo('unit', { async: true })
});
