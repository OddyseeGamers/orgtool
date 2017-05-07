import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr(),
  description: DS.attr(),
  img: DS.attr(),

//   templates: DS.hasMany('template', { inverse: 'category_id', async: true }),
  templates: DS.hasMany('template', { async: true }),

});
