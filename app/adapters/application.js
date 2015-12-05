import DS from 'ember-data';

export default DS.ActiveModelAdapter.extend({
//   host: 'http://www.oddysee.org',
  namespace: 'api/orgtool',

//   headers: {
//     'API_KEY': 'secret key',
//     'ANOTHER_HEADER': 'Some header value'
//   },

  shouldBackgroundReloadRecord: function() {
    return true;
  },

  shouldReloadAll: function() {
    return true;
  },
});


// export default DS.JSONAPIAdapter.extend({
// });
