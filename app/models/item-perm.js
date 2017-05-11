import DS from 'ember-data';

export default DS.Model.extend({
  user: DS.belongsTo('user'),
  read: DS.attr(),
  create: DS.attr(),
  edit: DS.attr(),
  delete: DS.attr(),
  inserted_at: DS.attr(),
  created_at: DS.attr(),
});
