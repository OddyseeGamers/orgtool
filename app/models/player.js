import DS from 'ember-data';

export default DS.Model.extend({
  numericID: Ember.computed('id', function() { return Number(this.get('id')) }),
  wp_id: DS.attr(),
  name: DS.attr(),
//   handle: DS.attr(),
  avatar: DS.attr(),
  timezone: DS.attr(),
  updated_at: DS.attr(),

  handles: DS.hasMany('handle'),
  items: DS.hasMany('items'), //, { async: true}),
//   ships: DS.hasMany('ship', { inverse: 'player', async: true}),
//   rewards: DS.attr(),
  logs: DS.attr(),

  playerships: DS.hasMany('unit'),
  leaderships: DS.hasMany('unit'),
  applications: DS.hasMany('unit'),

//   playerRewards: DS.hasMany('playerReward'),
  rewards: DS.hasMany('reward'),

  user: DS.belongsTo('user'),

  loggedIn: false,
});
