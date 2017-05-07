import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr(),
  description: DS.attr(),
  img: DS.attr(),

  category: DS.belongsTo('category', { async: true }),

//   items: DS.hasMany('item', { inverse: 'template_id', async: true }),
  items: DS.hasMany('item', { async: true }),

});
