// import DS from 'ember-data';
// export default DS.JSONAPISerializer.extend(DS.EmbeddedRecordsMixin,{
//   attrs: {
//     screenshots: { embedded: 'always' }
//   }
// });

import DS from 'ember-data';
import Ember from 'ember';
import config from '../config/environment';

export default DS.JSONAPISerializer.extend({
// export default DS.JSONAPISerializer.extend(DS.EmbeddedRecordsMixin, {
//   attrs: {
//     permission: { embedded: 'always' },
//     includeIds: true,
//   },

//   include: 'permission',
//   attrs: {
//     permission: { serialize: true }
//     inserted_at:  { serialize: false },
//     created_at:  { serialize: false }
//   },

  modelNameFromPayloadKey: function(key) {
  //     Ember.Logger.log("---> model", key);
    return Ember.String.singularize(key); //this.normalizeModelName(key));
  },

  payloadKeyFromModelName: function(modelName) {
      return Ember.String.singularize(modelName);
  },

/*
  normalize(modelClass, resourceHash) {
    console.debug("norm");
    let data = null;

    if (resourceHash) {
      this.normalizeUsingDeclaredMapping(modelClass, resourceHash);
      if (Ember.typeOf(resourceHash.links) === 'object') {
        this.normalizeUsingDeclaredMapping(modelClass, resourceHash.links);
      }

      data = {
        id:            this.extractId(modelClass, resourceHash),
        type:          modelClass.modelName,
        attributes:    this.extractAttributes(modelClass, resourceHash),
        relationships: this.extractRelationships(modelClass, resourceHash)
      };

      this.applyTransforms(modelClass, data.attributes);
    }

    return { data };
  },
*/

  serialize(snapshot) {
//     console.debug("serialize, snap", snapshot)
//     snapshot['include'] = ['permission'];
    let serialized = this._super(...arguments);
//     serialized["included"] = [];
//     let { adapterOptions } = snapshot;
//     if (adapterOptions && adapterOptions.updateRelationship === 'permission') {
//       return serialized.data.relationships.permission;
//     }

    if (serialized.data.included) {
      serialized.included = serialized.data.included;
      delete serialized.data.included;
    }

//     if (serialized.data.permission) {
//       serialized.included = [ serialized.data.permission.data ];
//       delete serialized.data.permission;
//     }


//     console.debug("serialize", serialized)
    return serialized;
  },



  serializeBelongsTo(snapshot, json, relationship) {
    let serialized = this._super(...arguments);

    var key = relationship.key;
    if (key == "permission") {
      var belongsTo = snapshot.belongsTo(key);
//       console.debug("serializeBelongsTo snap", snapshot);
//       console.debug("serializeBelongsTo bel ", belongsTo);

//       var js = {"type": key, "id": belongsTo.id, "attributes": belongsTo.record.toJSON() };
      var js = this.serialize(belongsTo).data;
      js["id"] = belongsTo.id;

//       console.debug("--- serializeBelongsTo ", key, "=", belongsTo.record.toJSON());
//       console.debug("--- serializeBelongsTo ", key, "=", js);

      if (json.included) {
        json.included.push(js);
      } else {
        json["included"] = [ js ];
      }
//       console.debug("--- serializeBelongsTo ", key, "=", json);
    }

//     key = this.keyForRelationship ? this.keyForRelationship(key, "belongsTo", "serialize") : key;
//     json[key] = Ember.isNone(belongsTo) ? belongsTo : belongsTo.record.toJSON();
  },


/*
  normalizeResponse(store, primaryModelClass, payload, id, requestType) {
    payload.data.attributes.amount = payload.data.attributes.cost.amount;
    payload.data.attributes.currency = payload.data.attributes.cost.currency;

    delete payload.data.attributes.cost;

    return this._super(...arguments);
  },
*/
/*
  serialize(snapshot) {
    let serialized = this._super(...arguments);
    let { adapterOptions } = snapshot;
    if (adapterOptions && adapterOptions.updateRelationship === 'permission') {
      return serialized.data.relationships.permission;
    }

    return serialized;
  }
*/
/*
  keyForAttribute: function(attr) {
    Ember.Logger.log("---> KEY", attr);
//     return Ember.String.underscore(attr);

    if (attr === 'is_some') {
      attr = 'is-seome';
    }

    return this._super(...arguments);
  },
*/

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
