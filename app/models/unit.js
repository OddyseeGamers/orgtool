import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr(),
  type: DS.attr(),
  description: DS.attr(),
  img: DS.attr(),
  color: DS.attr(),
//   leader: DS.hasMany('member', { async: true }),
  members: DS.hasMany('member', { inverse: 'unit', async: true }),

  parent: DS.belongsTo('unit', { inverse: 'units', async: false }),
  units: DS.hasMany('unit', { inverse: 'parent', async: false })
});

