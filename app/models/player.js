import DS from 'ember-data';

export default DS.Model.extend({
  numericID: Ember.computed('id', function() { return Number(this.get('id')) }),
//   wp_id: DS.attr(),
  name: DS.attr(),
  avatar: DS.attr(),
  timezone: DS.attr(),
  updated_at: DS.attr(),

  user: DS.belongsTo('user'),

  handles: DS.hasMany('handle'),
  items: DS.hasMany('items'),
  rewards: DS.hasMany('reward'),

  leaderships: DS.hasMany('unit'),
  playerships: DS.hasMany('unit'),
  applications: DS.hasMany('unit'),

  logs: DS.attr(),
  loggedIn: false,
});
