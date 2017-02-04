import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr(),
  description: DS.attr(),
  img: DS.attr(),
  level: DS.attr(),
  _rewards: DS.hasMany('reward', { async: true }),
  
  numericLevel: Ember.computed('level', function() { return Number(this.get('level')) }),
  p: ['numericLevel:asc'],
  rewards: Ember.computed.sort('_rewards', 'p'),
});
