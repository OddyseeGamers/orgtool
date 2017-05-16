import DS from 'ember-data';
import Ember from 'ember';
import config from '../config/environment';


// export default DS.ActiveModelAdapter.extend({


export default DS.JSONAPIAdapter.extend({
  session: Ember.inject.service('session'),
  host: config.APP.API_HOST,
  namespace: 'api',
//   headers: {
//     'Authorization': 'Bearer ' + window.jwt,
//   },
  headers: Ember.computed('session.token', function() {
    return {
      'Authorization': this.get('session.token'),
    };
  }),

  queryRecord(store, type, query) {
//     Ember.Logger.log("QUERY", store, "-------", type.modelName, "------------", query);

    if (query.id && query.recursive && type.modelName == "unit") {
      let url = this.buildURL(type.modelName, null, null, 'queryRecord', null);
      url += "/" + query.id + "?recursive=" + query.recursive;
//       console.log(">>>> URL", url);
      return this.ajax(url, 'GET', {});
    } else {
      let url = this.buildURL(type.modelName, null, null, 'queryRecord', query);
      if (this.sortQueryParams) {
        query = this.sortQueryParams(query);
      }
      return this.ajax(url, 'GET', { data: query });
    }
  },

  query(store, type, query) {
    if (query.id && query.recursive && type.modelName == "unit") {
      let url = this.buildURL(type.modelName, null, null, 'query', null);
      url += "/" + query.id + "?recursive=" + query.recursive;
//       console.log(">>>> URL", url);

      return this.ajax(url, 'GET', {});
    } else {
      let url = this.buildURL(type.modelName, null, null, 'query', query);

      if (this.sortQueryParams) {
        query = this.sortQueryParams(query);
      }

      return this.ajax(url, 'GET', { data: query });
    }
  },


  shouldReloadRecord: function(store, snapshot) {
    return true;
  },

  shouldReloadAll: function(store, snapshot) {
    return true;
  },

  shouldBackgroundReloadRecord: function(store, snapshot) {
    return false;
  },

  shouldBackgroundReloadAll: function(store, snapshot) {
    return false;
  }

//   pathForType: function(type) {
//     Ember.Logger.log("---> type", type);
//     return Ember.String.underscore(type);
//   }

/*
modelNameFromPayloadKey: function(key) {
    Ember.Logger.log("---> model", key);
  return singularize(normalizeModelName(key));
},
payloadKeyFromModelName: function(modelName) {
    Ember.Logger.log("---> pay", modelName);
  return pluralize(modelName);
},
*/
/*
    normalizeArrayResponse(store, primaryModelClass, payload, id, requestType) {
    let normalizedDocument = this._super(...arguments);

    // Customize document meta
    normalizedDocument.meta = camelCaseKeys(normalizedDocument.meta);

    Ember.Logger.log("---> doc", normalizedDocument);
    
    return normalizedDocument;
  },

  extractRelationship(relationshipHash) {
    let normalizedRelationship = this._super(...arguments);

    // Customize relationship meta
    normalizedRelationship.meta = camelCaseKeys(normalizedRelationship.meta);

    Ember.Logger.log("---> rel", normalizedRelationship);
    return normalizedRelationship;
  }
  */
});


//   export default DS.RESTAdapter.extend(DS.BuildURLMixin, {
// export default DS.JSONAPIADAPTER.extend({
//   host: config.APP.API_HOST,
//   namespace: 'api',

  // headers: { 
  //   'Accept': 'application/json',
  //   // TODO this was x-www-form-urlencoded
  //   'Content-Type': 'application/json; charset=UTF-8'
  //   //     "Accept": "application/json, text/javascript; q=0.01"
  //   //     "Access-Control-Request-Headers": "content-type"
  //   //     'Access-Control-Expose-Headers':'x-json'
  // },

//   pathForType: function(modelName) {
//     return Ember.String.pluralize(Ember.String.underscore(modelName));
//   },


//   updateRecord: function(store, type, snapshot) {
//     var url = this.urlForUpdateRecord(Ember.get(snapshot, 'id'), type.modelName, snapshot);
//     var data = snapshot.serialize();
// //     data["id"] = Ember.get(snapshot, 'id');
// // //     Ember.Logger.debug(">> where is the id", data);
// //     return this.ajax(url, 'PUT', {dataType: 'JSON', data: data});
// //   },

// //   shouldBackgroundReloadRecord: function() {
// //     return true;
// //   },

// //   shouldReloadAll: function() {
// //     return true;
// //   },
// });
