import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr(),
  description: DS.attr(),
  img: DS.attr(),
  level: DS.attr(),
  type: DS.belongsTo('rewardType', { async: true }),
  playerRewards: DS.hasMany('playerReward', { async: true }),

  numericLevel: Ember.computed('level', function() { return Number(this.get('level')) }),
});
