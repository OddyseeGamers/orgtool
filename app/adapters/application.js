import DS from 'ember-data';
import Ember from 'ember';
import config from '../config/environment';

// export default DS.ActiveModelAdapter.extend({

//   export default DS.RESTAdapter.extend(DS.BuildURLMixin, {
export default DS.RESTAdapter.extend({
  host: config.APP.API_HOST,
  namespace: 'wp-json/orgtool',

  headers: { 
    'Accept': '*',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    //     "Accept": "application/json, text/javascript; q=0.01"
    //     "Access-Control-Request-Headers": "content-type"
    //     'Access-Control-Expose-Headers':'x-json'
  },

  pathForType: function(modelName) {
    return Ember.String.pluralize(Ember.String.underscore(modelName));
  },


  updateRecord: function(store, type, snapshot) {
    var url = this.urlForUpdateRecord(Ember.get(snapshot, 'id'), type.modelName, snapshot);
    var data = snapshot.serialize();
//     data["id"] = Ember.get(snapshot, 'id');
//     Ember.Logger.debug(">> where is the id", data);
    return this.ajax(url, 'POST', {data: data});
  },

//   shouldBackgroundReloadRecord: function() {
//     return true;
//   },

//   shouldReloadAll: function() {
//     return true;
//   },
});
