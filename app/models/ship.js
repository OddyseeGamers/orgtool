import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr(),
  shipManufacturer: DS.belongsTo('shipManufacturer', { async: true }),
  type: DS.belongsTo('shipType', { async: true }),
  roles: DS.hasMany('shipRole', { async: true })
});
