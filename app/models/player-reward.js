import DS from 'ember-data';

export default DS.Model.extend({
  player: DS.belongsTo('player', { async: true }),
  reward: DS.belongsTo('reward', { async: true }),
});
