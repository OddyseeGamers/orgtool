import DS from 'ember-data';

export default DS.Model.extend({
  member: DS.belongsTo('member', { async: true }),
  reward: DS.belongsTo('reward', { async: true }),
});
