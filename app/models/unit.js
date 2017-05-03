import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr(),
  description: DS.attr(),
  img: DS.attr(),
  color: DS.attr(),

  type: DS.belongsTo('unitType', { async: true }),
  unit: DS.belongsTo('unit', { inverse: 'units', async: true }),
  units: DS.hasMany('unit', { inverse: 'unit', async: true }),
  members: DS.hasMany('member', { inverse: 'memberships', async: true }),
  leaders: DS.hasMany('member', { inverse: 'leaderships', async: true }),
  applicants: DS.hasMany('member', { inverse: 'applications', async: true }),

});
