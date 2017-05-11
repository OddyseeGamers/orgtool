import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr(),
  email: DS.attr(),
  inserted_at: DS.attr(),
  created_at: DS.attr(),
  is_admin: DS.attr(),
  member: DS.belongsTo('member'),
});
