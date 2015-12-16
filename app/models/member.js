import DS from 'ember-data';

export default DS.Model.extend({
  wp_id: DS.attr(),
  name: DS.attr(),
  handle: DS.attr(),
  avatar: DS.attr(),
  timezone: DS.attr(),
  updated_at: DS.attr(),
  ships: DS.hasMany('ship', { async: true}),
  units: DS.hasMany('unit', { async: true }),
  rewards: DS.attr(),
  logs: DS.attr(),
});
