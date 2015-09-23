import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr(),
  type: DS.attr(),
  desc: DS.attr(),
  color: DS.attr(),
  leader: DS.hasMany('member', { async: true }),
  pilots: DS.hasMany('member', { inverse: 'unit', async: true }),

  parent: DS.belongsTo('unit', { inverse: 'children', async: false }),
  children: DS.hasMany('unit', { inverse: 'parent', async: false })
});

