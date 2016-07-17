import DS from 'ember-data';

export default DS.Model.extend({
  numericID: Ember.computed('id', function() { return Number(this.get('id')) }),
  wp_id: DS.attr(),
  name: DS.attr(),
  handle: DS.attr(),
  avatar: DS.attr(),
  timezone: DS.attr(),
  updated_at: DS.attr(),
  ships: DS.hasMany('ship', { inverse: 'member', async: true}),
  memberUnits: DS.hasMany('memberUnit', { async: true }),
  rewards: DS.attr(),
  logs: DS.attr(),
});
