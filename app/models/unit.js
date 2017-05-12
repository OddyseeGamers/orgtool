import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr(),
  description: DS.attr(),
  img: DS.attr(),
  color: DS.attr(),

  unitType: DS.belongsTo('unitType', { inverse: 'units', async: true }),
  unit: DS.belongsTo('unit', { inverse: 'units', async: true }),

  units: DS.hasMany('unit', { inverse: 'unit', async: true }),
  players: DS.hasMany('player', { inverse: 'playerships', async: true }),
  leaders: DS.hasMany('player', { inverse: 'leaderships', async: true }),
  applicants: DS.hasMany('player', { inverse: 'applications', async: true }),
});
