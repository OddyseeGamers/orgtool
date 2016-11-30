import Ember from 'ember';

export default Ember.Service.extend(Ember.Evented, {
  after: "store",
  store: Ember.inject.service(),
  loading: true,
  state: null,
  models: null,
  units: null,
  members: null,
  shipManufacturers: null,

  createRequest: function(name, modelName) {
      var self = this;
      return self.get('store').findAll(modelName).then(function(data) {
        console.debug(" loaded ", name, Ember.get(data, 'length'));
        self.set(name, data);
        self.set("state", name);
        return data;
      });
  },

  loadThemAll: function() {
    var self = this;
    this.set('loading', true);
    self.set("state", null);

    this.models = Ember.RSVP.hash({
      units: this.createRequest("units", "unit"),
      members: this.createRequest("members", "member"),
      memberUnits: this.createRequest("memberUnits", "memberUnit"),
      unitTypes: self.createRequest("unitTypes", "unitType"),
//       ships: this.createRequest("ships", "ship")
//
      items: self.createRequest("items", "item"),
      itemTypes: self.createRequest("props", "prop"),
      itemProps: self.createRequest("itemProps", "itemProp"),
      itemTypes: self.createRequest("itemTypes", "itemType"),
    });
    return this.models.then(function(done) {
          console.debug("loading all done");// , done.get('length'));
          self.set("state", "done");
          self.set('loading', false);
    });


/*
    return this.models.then(function(done) {
      console.debug("loading all done");// , done.get('length'));
      self.set("state", "done");
      self.set('loading', false);
      self.models = Ember.RSVP.hash({

        ships: self.createRequest("ships", "ship"),
        shipModels: self.createRequest("shipModels", "shipModel"),
        shipManufacturers: self.createRequest("shipManufacturers", "shipManufacturer"),
        shipClass: self.createRequest("shipClass", "shipClass")
      });


    });
    */
  },

  getById(model, id) {
      var self = this;
      return this.get('models').then(function(done) {
        var rec = self.get('store').peekRecord(model, id);
        return rec;
      });
  },

  hasParent: function(id, model, attr) {
    try {
      return model.get("id") == id || model.get(attr) && this.hasParent(id, model.get(attr));
    } catch(err) {
        console.debug("error", err);
    }
    return false;
  },

});
