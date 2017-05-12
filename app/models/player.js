import DS from 'ember-data';

export default DS.Model.extend({
  numericID: Ember.computed('id', function() { return Number(this.get('id')) }),
  wp_id: DS.attr(),
  name: DS.attr(),
//   handle: DS.attr(),
  avatar: DS.attr(),
  timezone: DS.attr(),
  updated_at: DS.attr(),

  handles: DS.hasMany('handle', { inverse: 'player', async: true}),
  items: DS.hasMany('items', { inverse: 'player', async: true}),
//   ships: DS.hasMany('ship', { inverse: 'player', async: true}),
  rewards: DS.attr(),
  logs: DS.attr(),

  playerships: DS.hasMany('unit', {inverse: 'players', async: true }),
  leaderships: DS.hasMany('unit', {inverse: 'leaders', async: true }),
  applications: DS.hasMany('unit', {inverse: 'applicants', async: true }),

  playerRewards: DS.hasMany('playerReward', { async: true }),

  user: DS.belongsTo('user'),

  loggedIn: false,
});
