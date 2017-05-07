import DS from 'ember-data';

export default DS.Model.extend({
  numericID: Ember.computed('id', function() { return Number(this.get('id')) }),
  wp_id: DS.attr(),
  name: DS.attr(),
//   handle: DS.attr(),
  avatar: DS.attr(),
  timezone: DS.attr(),
  updated_at: DS.attr(),

  handles: DS.hasMany('handle', { inverse: 'member', async: true}),
  items: DS.hasMany('items', { inverse: 'member', async: true}),
//   ships: DS.hasMany('ship', { inverse: 'member', async: true}),
  rewards: DS.attr(),
  logs: DS.attr(),

  memberships: DS.hasMany('unit', {inverse: 'members', async: true }),
  leaderships: DS.hasMany('unit', {inverse: 'leaders', async: true }),
  applications: DS.hasMany('unit', {inverse: 'applicants', async: true }),

  memberRewards: DS.hasMany('memberReward', { async: true }),

  loggedIn: false,
});
