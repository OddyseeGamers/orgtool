import DS from 'ember-data';

export default DS.Model.extend({
  user: DS.attr(),
//   user: DS.belongsTo('handle', {  async: false, embedd: true }),
});
