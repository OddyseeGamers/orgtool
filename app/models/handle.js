import DS from 'ember-data';

export default DS.Model.extend({
  type: DS.attr(),
  name: DS.attr(),
  handle: DS.attr(),
  img: DS.attr(),
  player: DS.belongsTo('player', { async: true }),
});
