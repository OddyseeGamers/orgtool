import DS from 'ember-data';
import Ember from 'ember';
import config from '../config/environment';

export default DS.JSONAPISerializer.extend({


modelNameFromPayloadKey: function(key) {
//     Ember.Logger.log("---> model", key);
  return Ember.String.singularize(key); //this.normalizeModelName(key));
},
payloadKeyFromModelName: function(modelName) {
    return Ember.String.singularize(modelName);
},


  /*
  normalizeResponse(store, primaryModelClass, payload, id, requestType) {
//     payload.data.attributes.amount = payload.data.attributes.cost.amount;
//     payload.data.attributes.currency = payload.data.attributes.cost.currency;

    Ember.Logger.log("---> norm", primaryModelClass, "|", payload, "|", id);

//     delete payload.data.attributes.cost;

    return this._super(...arguments);
  },

  normalizeArrayResponse(store, primaryModelClass, payload, id, requestType) {
    let normalizedDocument = this._super(...arguments);

    // Customize document meta
//     normalizedDocument.meta = Ember.String.camelize(normalizedDocument.meta);
    Ember.Logger.log("---> doc", normalizedDocument, "|", payload, "|", id);

    return normalizedDocument;
  },

  extractRelationship(relationshipHash) {
    let normalizedRelationship = this._super(...arguments);

    // Customize relationship meta
//     normalizedRelationship.meta = Ember.String.camelize(normalizedRelationship.meta);
    Ember.Logger.log("---> rel", normalizedRelationship.meta);

    return normalizedRelationship;
  }
*/
});
