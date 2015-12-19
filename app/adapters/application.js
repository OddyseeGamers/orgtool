import DS from 'ember-data';
import Ember from 'ember';

// export default DS.ActiveModelAdapter.extend({

//   export default DS.RESTAdapter.extend(DS.BuildURLMixin, {
export default DS.RESTAdapter.extend({
  host: 'http://www.oddysee.org',
  namespace: 'wp-json/orgtool',


  pathForType: function(modelName) {
    return Ember.String.pluralize(Ember.String.underscore(modelName));
  },

  headers: { 
        'Accept': '*',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
//     "Accept": "application/json, text/javascript; q=0.01"
//     "Access-Control-Request-Headers": "content-type"
//     'Access-Control-Expose-Headers':'x-json'
  },

    updateRecord: function(store, type, snapshot) {
      var url = this.urlForUpdateRecord(Ember.get(snapshot, 'id'), type.modelName, snapshot);
      console.debug(">>> send", snapshot.serialize());
      return this.ajax(url, 'POST', {data: snapshot.serialize()});
    },
    
  shouldBackgroundReloadRecord: function() {
    return true;
  },

  shouldReloadAll: function() {
    return true;
  },
});
