import DS from 'ember-data';

export default DS.ActiveModelAdapter.extend({
  namespace: 'api',

  shouldBackgroundReloadRecord: function() {
    return true;
  },

  shouldReloadAll: function() {
    return true;
  },
});


// export default DS.JSONAPIAdapter.extend({
// });
