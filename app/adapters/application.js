import DS from 'ember-data';

export default DS.ActiveModelAdapter.extend({
  host: 'http://www.oddysee.org',
  namespace: 'api/orgtool',

  buildURL: function(modelName, id, snapshot, requestType, query) {
    switch (requestType) {
      case 'findRecord':
        return this.urlForFindAll(modelName) + "/?id=" + id;
      case 'findAll':
        return this.urlForFindAll(modelName) + "/";
    /*
      case 'query':
        return this.urlForQuery(query, modelName);
      case 'queryRecord':
        return this.urlForQueryRecord(query, modelName);
      case 'findMany':
        return this.urlForFindMany(id, modelName, snapshot);
      case 'findHasMany':
        return this.urlForFindHasMany(id, modelName);
      case 'findBelongsTo':
        return this.urlForFindBelongsTo(id, modelName);
      case 'createRecord':
        return this.urlForCreateRecord(modelName, snapshot);
      case 'updateRecord':
        return this.urlForUpdateRecord(id, modelName, snapshot);
      case 'deleteRecord':
        return this.urlForDeleteRecord(id, modelName, snapshot);
    */
      default:
        return this._buildURL(modelName, id);
    }
  },

/*
  headers: {
        'Accept': '*',
        'Content-Type': 'application/json'
//         'Content-Length': '0'
//     'API_KEY': 'secret key',
//     'ANOTHER_HEADER': 'Some header value'
  },
*/
  shouldBackgroundReloadRecord: function() {
    return true;
  },

  shouldReloadAll: function() {
    return true;
  },
});


// export default DS.JSONAPIAdapter.extend({
// });
