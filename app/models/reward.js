import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr(),
  description: DS.attr(),
  img: DS.attr(),
  level: DS.attr(),
  rewardType: DS.belongsTo('rewardType'),
//   playerRewards: DS.hasMany('playerReward', { async: true }),
  players: DS.hasMany('player'),

  numericLevel: Ember.computed('level', function() { return Number(this.get('level')) }),
});
