import Ember from 'ember';

export default Ember.Service.extend(Ember.Evented, {
  after: "store",
  store: Ember.inject.service(),
  loading: true,
  state: null,
  models: null,
  units: null,
  members: null,

  createRequest: function(name, modelName) {
      var self = this;
      return self.get('store').findAll(modelName).then(function(data) {
        console.debug(" load ", modelName);
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
//       ships: this.createRequest("ships", "ship")
    });

    return this.models.then(function(done) {
      console.debug("loading all done");// , done.get('length'));
      self.set("state", "done");
      self.set('loading', false);
      self.models = Ember.RSVP.hash({
        unitTypes: self.createRequest("unitTypes", "unitType"),
        ships: self.createRequest("ships", "ship"),
        shipModels: self.createRequest("shipModels", "shipModel"),
        shipManufacturers: self.createRequest("shipManufacturers", "shipManufacturer"),
        shipClass: self.createRequest("shipClass", "shipClass")
      });


    });
  },


  loadAssets: function() {
    console.debug("-------- load them all 2");
    var self = this;
    this.set('loading', true);
    self.set("state", "start");
    var self = this;

    this.models = Ember.RSVP.hash({
      units: this.createRequest("units", "unit"),
      unitTypes: this.createRequest("unitTypes", "unitType"),
      members: this.createRequest("members", "member"),
      memberUnits: this.createRequest("memberUnits", "memberUnit"),
      ships: this.createRequest("ships", "ship"),
      shipModels: this.createRequest("shipModels", "shipModel"),
      shipManufacturers: this.createRequest("shipManufacturers", "shipManufacturer"),
      shipClass: this.createRequest("shipClass", "shipClass")
    });

    return this.models.then(function(done) {
      console.debug(" all done" ,done);
      self.set("state", "done");
      self.set('loading', false);
    });
  },


});
