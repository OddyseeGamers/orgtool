import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr(),
  ship: DS.belongsTo('ship', { async: true }),
  member: DS.belongsTo('member', { async: true }),
});
