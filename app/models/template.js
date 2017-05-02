import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr(),
  description: DS.attr(),
  img: DS.attr(),

  category_id: DS.belongsTo('category', {inverse: 'templates', async: true }),

  items: DS.hasMany('item', { inverse: 'template_id', async: true }),

});
