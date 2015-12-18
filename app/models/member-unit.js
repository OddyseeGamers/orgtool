import DS from 'ember-data';

export default DS.Model.extend({
  member: DS.belongsTo('member', { async: true }),
  unit: DS.belongsTo('unit', { async: true }),
});
