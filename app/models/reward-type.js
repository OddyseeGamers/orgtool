import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr(),
  description: DS.attr(),
  img: DS.attr(),
  level: DS.attr(),
  rewards: DS.hasMany('reward'),
  
  numericLevel: Ember.computed('level', function() { return Number(this.get('level')) }),
  p: ['numericLevel:asc'],
  sortedRewards: Ember.computed.sort('rewards', 'p'),
});
