import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr(),
  type: DS.attr(),
  desc: DS.attr(),
  color: DS.attr(),
  leaders: DS.attr(),
  pilots: DS.attr(),

  parent: DS.belongsTo('unit', { inverse: 'units', async: false }),
  units: DS.hasMany('unit', { inverse: 'parent', async: false })
});

