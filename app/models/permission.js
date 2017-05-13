import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
  user: DS.belongsTo('user'),

  user_read: DS.attr(),
  user_create: DS.attr(),
  user_edit: DS.attr(),
  user_delete: DS.attr(),
  
  player_read: DS.attr(),
  player_create: DS.attr(),
  player_edit: DS.attr(),
  player_delete: DS.attr(),
  
  unit_read: DS.attr(),
  unit_create: DS.attr(),
  unit_edit: DS.attr(),
  unit_delete: DS.attr(),
  unit_apply: DS.attr(),
  unit_accept: DS.attr(),
  unit_assign: DS.attr(),
  
  category_read: DS.attr(),
  category_create: DS.attr(),
  category_edit: DS.attr(),
  category_delete: DS.attr(),
  
  template_read: DS.attr(),
  template_create: DS.attr(),
  template_edit: DS.attr(),
  template_delete: DS.attr(),
  
  item_read: DS.attr(),
  item_create: DS.attr(),
  item_edit: DS.attr(),
  item_delete: DS.attr(),
  
  reward_read: DS.attr(),
  reward_create: DS.attr(),
  reward_edit: DS.attr(),
  reward_delete: DS.attr(),

  inserted_at: DS.attr(),
  created_at: DS.attr(),


  settings: Ember.computed('user_read', 'item_read', 'reward_read', function() {
    return this.get('user_read') || this.get('item_read') || this.get('reward_read');
  }),

  item_list_filter: Ember.computed('category_read', 'template_read', 'item_read', function() {
    return this.get('user_read') || this.get('item_read') || this.get('reward_read');
  }),

  item_tb: Ember.computed('item_edit', 'item_delete', function() {
    return this.get('item_edit') || this.get('item_delete');
  }),
});
