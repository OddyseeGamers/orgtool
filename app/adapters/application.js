import DS from 'ember-data';

export default DS.ActiveModelAdapter.extend({
// export default DS.JSONAPIAdapter.extend({
  namespace: 'api',

  shouldBackgroundReloadRecord: function() {
    return true;
  },

  shouldReloadAll: function() {
    return true;
  },
});

